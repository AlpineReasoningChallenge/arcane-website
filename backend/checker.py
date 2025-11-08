import time
import threading
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv
from notify import send_submission_notification

# --- LOAD ENV VARIABLES ---
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
    print("[INFO] Loaded environment variables from .env.local")
else:
    print("[INFO] .env.local not found, reading from system environment variables")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
CORRECT_ANSWERS_JSON = os.getenv("CORRECT_ANSWERS")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase URL or Key. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local or as environment variables.")

if not CORRECT_ANSWERS_JSON:
    raise ValueError("Missing CORRECT_ANSWERS. Set CORRECT_ANSWERS in .env.local or as an environment variable.")

# --- PARSE CORRECT ANSWERS FROM ENV ---
try:
    CORRECT_ANSWERS = json.loads(CORRECT_ANSWERS_JSON)
    # Convert string keys to integers (JSON keys are always strings)
    CORRECT_ANSWERS = {int(k): v for k, v in CORRECT_ANSWERS.items()}
except json.JSONDecodeError as e:
    raise ValueError(f"Invalid CORRECT_ANSWERS JSON format: {str(e)}")

# --- SUPABASE CLIENT ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Connected to:", SUPABASE_URL)
test = supabase.table("user_puzzle_attempts").select("count", count="exact").execute()
print("Rows in table:", test.count)

# --- GLOBAL STATE ---
iteration_hours = 1
next_run_time = None
stop_countdown = threading.Event()


def check_and_update_answers():
    response = supabase.table("user_puzzle_attempts").select("*").is_("is_correct", None).execute()
    attempts = response.data or []
    print(f"\n[INFO] Found {len(attempts)} pending attempts.")

    for attempt in attempts:
        attempt_id = attempt["id"]
        puzzle_id = attempt["puzzle_id"]
        user_id = attempt["user_id"]
        user_answer = attempt["answer"].strip()
        correct_answer = CORRECT_ANSWERS.get(puzzle_id, "").strip()
        is_correct = (user_answer == correct_answer)

        user_profile = supabase.table("profiles").select("username").eq("id", user_id).execute()
        if user_profile.data and len(user_profile.data) > 0:
                username = user_profile.data[0]["username"]
        supabase.table("user_puzzle_attempts").update({"username": username}).eq("id", attempt_id).execute()
        print(f"Updated ID {attempt_id} (Puzzle {puzzle_id}) -> {'CORRECT' if is_correct else 'INCORRECT'}")
        
        send_submission_notification(
                    recipient_email=user_email,
                    puzzle_id=puzzle_id,
                    state="correct" if is_correct else "incorrect"
                )
            else:
                print(f"[WARNING] Could not find email for user {user_id}")
        except Exception as e:
            print(f"[ERROR] Failed to send notification for attempt {attempt_id}: {str(e)}")

    print("[INFO] Check complete.\n")


def init_scheduler():
    global next_run_time
    while True:
        next_run_time = time.time() + iteration_hours * 3600
        countdown_thread = threading.Thread(target=show_countdown, daemon=True)
        countdown_thread.start()

        time.sleep(iteration_hours * 3600)
        stop_countdown.set()
        check_and_update_answers()
        stop_countdown.clear()


def show_countdown():
    while not stop_countdown.is_set():
        remaining = int(next_run_time - time.time())
        hours, remainder = divmod(remaining, 3600)
        minutes, seconds = divmod(remainder, 60)
        print(f"\rNext check in {hours:02d}:{minutes:02d}:{seconds:02d}", end="", flush=True)
        time.sleep(1)
    print("\r" + " " * 40 + "\r", end="")  # clear line after stopping countdown


def console():
    print("Supabase Puzzle Checker Console")
    print("Commands:")
    print("  init          -> start periodic checking")
    print("  run           -> run one manual check now")
    print("  iteration X   -> set interval (hours)")
    print("  quit          -> exit program\n")

    while True:
        cmd = input(">> ").strip().lower()
        if cmd.startswith("iteration "):
            try:
                global iteration_hours
                iteration_hours = float(cmd.split()[1])
                print(f"[INFO] Iteration interval set to {iteration_hours} hour(s).")
            except (IndexError, ValueError):
                print("[ERROR] Invalid format. Use: iteration X")
        elif cmd == "init":
            print(f"[INFO] Scheduler initialized. Running checks every {iteration_hours} hour(s).")
            threading.Thread(target=init_scheduler, daemon=True).start()
        elif cmd == "run":
            print("[INFO] Running one manual check...")
            check_and_update_answers()
        elif cmd in ("quit", "exit"):
            print("[INFO] Exiting console.")
            os._exit(0)
        else:
            print("[ERROR] Unknown command.")


if __name__ == "__main__":
    console()
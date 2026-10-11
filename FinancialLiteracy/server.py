import json
import os
import random
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


APP_DIRECTORY = Path(__file__).resolve().parent
QUIZ_TOPICS = {
    "budgeting": "Budgeting Basics: student allowances, needs and wants, planning, saving goals, and everyday spending.",
    "emergency": "Emergency Funds: unexpected costs, accessible savings buffers, gradual contributions, and protecting essential daily money.",
    "scams": "Digital Scam Safety: UPI payments, QR-code requests, OTPs, suspicious links, impersonation, and safe verification.",
}
QUIZ_QUESTION_COUNTS = {"budgeting": 5, "emergency": 3, "scams": 3}
QUIZ_FALLBACK_QUESTIONS = {
    "budgeting": [
        {
            "question": "You receive ₹1,000 for the week. Your bus pass costs ₹250 and lunch costs ₹350. What is the best first step?",
            "options": ["Set aside the ₹600 for essentials, then plan the remaining ₹400", "Spend the full ₹1,000 on a new accessory", "Borrow money before checking your costs", "Ignore the bus pass until the end of the week"],
            "answer": 0,
            "why": "Planning for essential travel and food first helps you use the remaining allowance intentionally.",
        },
        {
            "question": "You want to save ₹1,200 for a course in four months. How much should you aim to save each month?",
            "options": ["₹100", "₹300", "₹600", "₹1,200"],
            "answer": 1,
            "why": "Dividing the ₹1,200 goal by four months gives a manageable monthly target of ₹300.",
        },
        {
            "question": "After paying for your bus pass, you have ₹500 left. You also want to buy a ₹350 book this month. What helps you decide?",
            "options": ["Check your food and other essential costs before buying the book", "Buy the book and assume the other costs will work out", "Spend the ₹500 today because it is available", "Skip tracking your spending"],
            "answer": 0,
            "why": "A budget checks essential costs before deciding how much is available for wants.",
        },
        {
            "question": "You planned ₹200 for snacks but have already spent ₹180. Friends invite you to spend ₹100 more. What is a sensible choice?",
            "options": ["Check your remaining budget and choose a lower-cost option if needed", "Use money set aside for your bus fare", "Borrow without making a repayment plan", "Ignore your budget because it is only a small amount"],
            "answer": 0,
            "why": "Tracking what remains helps you enjoy time with friends without putting essential spending at risk.",
        },
        {
            "question": "You receive a monthly allowance of ₹2,000 and want to build savings. Which habit is most useful?",
            "options": ["Set a realistic savings amount when the allowance arrives", "Save only if money happens to remain at month-end", "Spend first and avoid writing anything down", "Put all the allowance into one day's shopping"],
            "answer": 0,
            "why": "Saving a planned amount first makes progress toward a goal more consistent.",
        },
        {
            "question": "Your monthly bus pass rises by ₹100. What should you do with your budget?",
            "options": ["Update the travel amount and review flexible spending", "Pretend the cost did not change", "Stop tracking expenses", "Use your entire savings goal amount automatically"],
            "answer": 0,
            "why": "A budget should reflect current costs so you can adjust lower-priority spending knowingly.",
        },
        {
            "question": "You are comparing two phone accessories. One is a need for class and one is a style upgrade. Which should your budget consider first?",
            "options": ["The item needed for class, while checking it fits your budget", "The more expensive item, regardless of your budget", "Both items using money meant for food", "Neither item's cost"],
            "answer": 0,
            "why": "Prioritizing needs helps keep important spending on track before optional purchases.",
        },
        {
            "question": "You have ₹150 left in your weekly budget and four days until your next allowance. What is the best move?",
            "options": ["Estimate necessary costs for all four days before spending", "Spend it all today", "Lend it all without checking your own needs", "Assume a friend will cover your travel"],
            "answer": 0,
            "why": "Planning across the remaining days helps avoid running short before the next allowance.",
        },
        {
            "question": "You saved ₹400 toward a laptop goal this month. An unplanned sale appears. What should guide your choice?",
            "options": ["Compare the purchase with your needs, budget, and laptop goal", "Buy immediately because the item is discounted", "Use money reserved for essential bills", "Stop saving because the goal is far away"],
            "answer": 0,
            "why": "A discount is only useful if the purchase fits your priorities and planned spending.",
        },
        {
            "question": "Why is it useful to write down small UPI purchases during the week?",
            "options": ["Small payments can add up and tracking shows where money goes", "It automatically increases your balance", "It guarantees every purchase is a need", "It removes the need for a budget"],
            "answer": 0,
            "why": "Recording small expenses makes it easier to compare actual spending with your plan.",
        },
    ],
    "emergency": [
        {
            "question": "Your phone screen repair costs ₹500 and you have ₹600 left for the month. How can an emergency buffer help?",
            "options": ["Use part of the buffer and part of your remaining budget to protect travel money", "Spend all ₹600 immediately and hope for more", "Ignore the repair and keep spending normally", "Borrow the full amount without discussing repayment"],
            "answer": 0,
            "why": "Sharing an unexpected cost with a buffer can preserve money needed for daily essentials.",
        },
        {
            "question": "You can save ₹100 each month for emergencies. What is a good approach?",
            "options": ["Build the buffer gradually and keep it accessible for genuine unexpected needs", "Invest it all in a highly unpredictable option", "Spend it on planned entertainment", "Wait until you can save a very large amount at once"],
            "answer": 0,
            "why": "Regular small contributions can build a useful emergency cushion over time.",
        },
        {
            "question": "Which expense is the best reason to use an emergency fund?",
            "options": ["An unexpected essential medicine cost", "A planned movie with friends", "A new game released this week", "A snack you buy every day"],
            "answer": 0,
            "why": "An emergency fund is for unexpected needs, not regular or planned wants.",
        },
        {
            "question": "After using some emergency savings for a repair, what can you do next?",
            "options": ["Plan small contributions to rebuild the buffer", "Assume you will never need it again", "Spend the rest on a non-essential purchase", "Hide the expense from your budget"],
            "answer": 0,
            "why": "Rebuilding gradually restores protection for future unexpected costs.",
        },
        {
            "question": "Why should emergency savings be kept somewhere reasonably accessible?",
            "options": ["A genuine urgent expense may need to be paid quickly", "It must earn the highest possible return", "It should be impossible to withdraw", "It is meant for daily shopping"],
            "answer": 0,
            "why": "Accessibility helps the money serve its purpose when an urgent need occurs.",
        },
        {
            "question": "Your friend asks to borrow the money you set aside for an urgent medical cost. What should you consider?",
            "options": ["Protect the amount you need for emergencies and discuss only what you can safely lend", "Lend all of it immediately", "Use your bus fare instead", "Assume you can replace it tomorrow"],
            "answer": 0,
            "why": "An emergency buffer should remain available for essential unexpected needs.",
        },
    ],
    "scams": [
        {
            "question": "A caller says they are from your bank and asks for your UPI PIN to stop a payment. What should you do?",
            "options": ["Do not share the PIN; end the call and contact the bank through its official channel", "Share the PIN so they can cancel the payment", "Read out an OTP to prove your identity", "Install an app they send you"],
            "answer": 0,
            "why": "Banks do not need your UPI PIN or OTP to protect your account; contact them independently.",
        },
        {
            "question": "A stranger sends a QR code and says scanning it will let them send you money. What is safest?",
            "options": ["Do not scan it; verify the request using a trusted channel", "Scan it and enter your UPI PIN to receive money", "Forward it to your classmates", "Share your screen while scanning"],
            "answer": 0,
            "why": "A QR code can initiate a payment, so verify unexpected requests and never enter a PIN to receive money.",
        },
        {
            "question": "You receive a message promising a prize if you urgently pay a small UPI fee through a link. What should you do?",
            "options": ["Avoid the link and check the claim with the official organization", "Pay quickly before the offer expires", "Send the message your OTP", "Enter your bank details on the linked page"],
            "answer": 0,
            "why": "Urgency, prize claims, and payment links are warning signs that should be verified independently.",
        },
        {
            "question": "A classmate messages from a new number asking you to transfer money urgently. What should you do first?",
            "options": ["Verify their identity by calling a number you already know", "Transfer immediately without checking", "Ask them to send an OTP", "Post their payment details publicly"],
            "answer": 0,
            "why": "A separate trusted contact method can confirm whether the request is genuine.",
        },
        {
            "question": "A website reached from an unexpected SMS asks for your card details and OTP. What is safest?",
            "options": ["Close it and open the official site or app yourself", "Enter the OTP to check the page", "Save your card details for convenience", "Forward the link to your friends"],
            "answer": 0,
            "why": "Opening official services yourself avoids entering sensitive information on a deceptive link.",
        },
        {
            "question": "You accidentally approved a suspicious UPI payment. What should you do?",
            "options": ["Contact your bank promptly through its official number and report the fraud", "Delete all messages and wait a week", "Share another OTP with the caller", "Pay a stranger who promises a refund"],
            "answer": 0,
            "why": "Promptly contacting the bank and reporting the incident can help you take the right next steps.",
        },
    ],
}
RATE_LIMIT = 10
RATE_WINDOW_SECONDS = 60
request_times = {}
request_times_lock = threading.Lock()


def load_local_env():
    env_file = APP_DIRECTORY / ".env"
    if not env_file.exists():
        return

    for line in env_file.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        name, value = stripped.split("=", 1)
        name = name.strip()
        value = value.strip().strip("\"'")
        if name and value and name not in os.environ:
            os.environ[name] = value


def send_json(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    origin = handler.headers.get("Origin", "")
    if is_local_browser_origin(origin):
        handler.send_header("Access-Control-Allow-Origin", origin)
        handler.send_header("Vary", "Origin")
    handler.end_headers()
    handler.wfile.write(body)


def is_local_browser_origin(origin):
    parsed_origin = urlsplit(origin)
    return (
        parsed_origin.scheme in {"http", "https"}
        and parsed_origin.hostname in {"localhost", "127.0.0.1"}
        and parsed_origin.username is None
        and parsed_origin.password is None
        and parsed_origin.path == ""
        and parsed_origin.query == ""
        and parsed_origin.fragment == ""
    )


def allow_request(client_address):
    now = time.monotonic()
    cutoff = now - RATE_WINDOW_SECONDS
    with request_times_lock:
        recent = [timestamp for timestamp in request_times.get(client_address, []) if timestamp > cutoff]
        if len(recent) >= RATE_LIMIT:
            request_times[client_address] = recent
            return False
        recent.append(now)
        request_times[client_address] = recent
        return True


def request_generated_questions(topic, api_key, model):
    topic_description = QUIZ_TOPICS[topic]
    question_count = QUIZ_QUESTION_COUNTS[topic]
    prompt = (
        f"Create a fresh quiz for Grades 11–12 students in Hyderabad, India, about {topic_description}\n"
        f"Return exactly {question_count} original multiple-choice questions. Each must have exactly four concise options, "
        "one unambiguous correct answer, and a one-sentence explanation. Use realistic student situations "
        "such as allowances, college bus passes, UPI payments, or family emergencies when relevant. "
        "Keep the content educational, age-appropriate, and not personalized financial advice. "
        "Vary scenarios and amounts from earlier quizzes. Do not include markdown or any text outside the JSON object.\n"
        'Required JSON: {"questions":[{"question":"...","options":["...","...","...","..."],'
        '"answer":0,"why":"..."}]}\n'
        f"The answer is a zero-based integer index into options. Return exactly {question_count} question objects."
    )
    body = json.dumps({
        "model": model,
        "temperature": 1,
        "max_completion_tokens": 1400,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "You create accurate, safe financial-literacy learning materials for Indian high-school students."},
            {"role": "user", "content": prompt},
        ],
    }).encode("utf-8")
    request = Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=35) as response:
            provider_payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        if error.code == 429:
            raise RuntimeError("The quiz service is busy. Please wait a moment and try again.") from None
        raise RuntimeError("The quiz provider rejected the generation request. Check the server configuration.") from None
    except (URLError, TimeoutError, json.JSONDecodeError, UnicodeDecodeError):
        raise RuntimeError("The quiz provider could not be reached. Please try again.") from None

    try:
        content = provider_payload["choices"][0]["message"]["content"]
        quiz = json.loads(content)
    except (KeyError, IndexError, TypeError, json.JSONDecodeError):
        raise RuntimeError("The quiz provider returned an unreadable response. Please try again.") from None

    questions = quiz.get("questions") if isinstance(quiz, dict) else None
    if not isinstance(questions, list) or len(questions) != question_count:
        raise RuntimeError(f"The quiz provider did not return exactly {question_count} questions. Please try again.")

    for question in questions:
        if not isinstance(question, dict):
            raise RuntimeError("The quiz provider returned a question in an invalid format. Please try again.")
        text = question.get("question")
        options = question.get("options")
        answer = question.get("answer")
        explanation = question.get("why")
        if (
            not isinstance(text, str) or not text.strip() or len(text) > 500
            or not isinstance(options, list) or len(options) != 4
            or any(not isinstance(option, str) or not option.strip() or len(option) > 240 for option in options)
            or type(answer) is not int or answer < 0 or answer > 3
            or not isinstance(explanation, str) or not explanation.strip() or len(explanation) > 400
        ):
            raise RuntimeError("The quiz provider returned a question in an invalid format. Please try again.")
        if len({option.strip().casefold() for option in options}) != 4:
            raise RuntimeError("The quiz provider returned duplicate answer choices. Please try again.")

    return questions


def get_fallback_questions(topic):
    selected_questions = random.sample(
        QUIZ_FALLBACK_QUESTIONS[topic],
        QUIZ_QUESTION_COUNTS[topic],
    )
    questions = []
    for question in selected_questions:
        options = list(enumerate(question["options"]))
        random.shuffle(options)
        questions.append({
            "question": question["question"],
            "options": [option for _, option in options],
            "answer": next(index for index, (original_index, _) in enumerate(options) if original_index == question["answer"]),
            "why": question["why"],
        })
    return questions


class MoneySmartHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIRECTORY), **kwargs)

    def do_OPTIONS(self):
        route = urlsplit(self.path).path
        origin = self.headers.get("Origin", "")
        if route not in {"/api/generate-quiz", "/FinancialLiteracy/api/generate-quiz"}:
            send_json(self, 404, {"error": "API route not found."})
            return
        if not is_local_browser_origin(origin):
            send_json(self, 403, {"error": "Quiz requests are only allowed from a local app page."})
            return

        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")
        self.end_headers()

    def do_POST(self):
        route = urlsplit(self.path).path
        if route not in {"/api/generate-quiz", "/FinancialLiteracy/api/generate-quiz"}:
            send_json(self, 404, {"error": "API route not found."})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            send_json(self, 400, {"error": "Invalid request size."})
            return
        if content_length < 1 or content_length > 4096:
            send_json(self, 400, {"error": "Request must include a valid quiz topic."})
            return
        if not allow_request(self.client_address[0]):
            send_json(self, 429, {"error": "Too many quiz requests. Please wait a minute and try again."})
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            send_json(self, 400, {"error": "Request must be valid JSON."})
            return
        topic = payload.get("topic") if isinstance(payload, dict) else None
        if topic not in QUIZ_TOPICS:
            send_json(self, 400, {"error": "Choose one of the available quiz topics."})
            return

        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key:
            send_json(self, 200, {
                "topic": topic,
                "questions": get_fallback_questions(topic),
                "source": "practice",
            })
            return

        model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
        try:
            questions = request_generated_questions(topic, api_key, model)
        except RuntimeError as error:
            send_json(self, 502, {"error": str(error)})
            return
        send_json(self, 200, {"topic": topic, "questions": questions, "source": "ai"})


if __name__ == "__main__":
    load_local_env()
    port = int(os.environ.get("PORT", "8001"))
    server = ThreadingHTTPServer(("127.0.0.1", port), MoneySmartHandler)
    print(f"MoneySmart server running at http://127.0.0.1:{port}/")
    server.serve_forever()

# Seva-Sadhana 🪷

**Seva begins where awareness meets action.** 
*“They alone live who live for others.” — Swami Vivekananda*

Seva-Sadhana is a dignity-first community service and reflection platform built for the **Vivekananda Hackathon**. It leverages technology not as the *Seva* itself, but as an enabler to bring people together. The platform removes ego, public leaderboards, and gamification from social work, replacing it with a system designed for inner growth, skill exchange, and private reflection.

---

## 🌟 Key Features

### 1. **Opportunity Radar (Seva Radar)**
Discover real-time community needs around you. The radar maps local and online Seva opportunities matching your daily intention (Sankalp).

### 2. **Spot a Need (GPS & Photo Integration)**
A feature allowing third-party users to report genuine needs they spot in the community.
- Captures real-time GPS location via browser (`navigator.geolocation`).
- Allows users to upload a photo of the situation.
- Instantly reflects the reported need on the public Seva Radar for volunteers to pick up.

### 3. **Barter Seva (Skill Exchange)**
Everyone has something to give, and everyone has something to learn. Offer your skills (e.g., coding, teaching math) in exchange for someone else's skills (e.g., organic farming basics) to build a self-reliant community.

### 4. **Blessing Inbox**
A private inbox where you receive gratitude notes from the people you have helped. Emphasizes the joy of giving without public show-off.

### 5. **Daily Sankalp & Reflection**
Set a daily intention (Sankalp) like *Dhairya (Patience)* or *Karuna (Compassion)*. The platform encourages you to reflect privately on what you learned during your service, shifting the focus from "being a savior" to "recognizing the divinity in service."

### 6. **SevaBot (Voice + Text AI Chatbot)**
An integrated, philosophical AI assistant designed to guide users through the platform.
- **Voice Recognition:** Talk to the bot directly using the Web Speech API.
- **Philosophical Guidance:** The bot is strictly instructed to ensure users never feel "superior" while helping others, providing teachings based on Swami Vivekananda's philosophy of humility and ego-dissolution.
- **Smart Navigation:** Ask the bot "I want to report a need" or "Take me to my inbox," and it will automatically route you to the correct page.

### 7. **Dignity Rule (No Leaderboards)**
*Seva-Sadhana does not track public leaderboards or point counts. Every action is a private mirror for personal reflection.*

---

## 🛠️ Technology Stack

This is a monolithic repository containing a modern web frontend and a Python backend.

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons. (Located in `apps/web`)
- **Backend:** FastAPI (Python), Uvicorn. (Located in `api`)
- **Styling:** Custom "Bhari" (Heavy/Bold) aesthetic with large serif typography (Times New Roman style) and warm, earthy color palettes inspired by Indian heritage.
- **State Management:** LocalStorage and DOM event synchronization for seamless, database-free prototyping.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Invincible2K25/Vivekananda_H.git
cd Vivekananda_H
```

### 2. Start the Frontend (Next.js)
```bash
cd apps/web
npm install
npm run dev
```
*The frontend will be available at http://localhost:3000*

### 3. Start the Backend (FastAPI)
Open a new terminal window:
```bash
cd api
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*The API will be available at http://localhost:8000*

---

## 💡 Philosophy

At Seva-Sadhana, we follow four core principles:
1. **Potential divinity in everyone:** No ranks, no scores, no labels. We only have participants.
2. **The giver receives more:** Every Seva requires you to record what you learned, not just what you gave.
3. **Work without attachment to results:** Your reflections are private. We don't count your hours publicly.
4. **Empowerment, avoid dependency:** Every technical need requires a handover plan so the community becomes self-reliant.

---
*Built with ❤️ for the Vivekananda Hackathon.*
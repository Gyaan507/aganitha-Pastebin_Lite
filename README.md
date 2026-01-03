# Pastebin-Lite

A robust, serverless pastebin application built with **Next.js 15** and **MongoDB**. This application allows users to create text pastes that automatically expire based on time (TTL) or view counts.

## 🌟 Features

* **Create Pastes:** Store arbitrary text content securely.
* **Time-to-Live (TTL):** Optional expiration time (in seconds). Pastes are automatically invalidated after the specified duration.
* **View Limits:** Optional maximum view count. The paste becomes completely unavailable (404) once the limit is reached.
* **Atomic View Counting:** Uses MongoDB atomic operators to strictly enforce view limits, preventing race conditions under concurrent load.
* **Deterministic Testing:** Supports the `x-test-now-ms` header (in Test Mode) to simulate time travel for automated grading.

## 🛠 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** MongoDB (via Mongoose ODM)
* **Styling:** Tailwind CSS
* **Deployment:** Vercel (Recommended)

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

* Node.js 18+ installed.
* A MongoDB connection string (Local or Atlas).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/pastebin-lite.git](https://github.com/YOUR_GITHUB_USERNAME/pastebin-lite.git)
    cd pastebin-lite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your MongoDB credentials:

    ```env
    # MongoDB Connection String
    MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/pastebin-lite"

    # Set to "1" to enable deterministic time testing via headers
    TEST_MODE="1"
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💾 Persistence Layer

**Choice: MongoDB (Mongoose)**

I selected MongoDB for this project for two primary reasons:
1.  **Document Model:** The data structure for a paste (content, metadata, flexible expiration settings) maps perfectly to a JSON-like document model.
2.  **Atomic Operations:** To satisfy the strict "Max Views" requirement, I utilized MongoDB's `findOneAndUpdate` with the `$inc` operator. This ensures that checking the view count and incrementing it happens in a single atomic transaction. This guarantees that even if two users request the paste at the exact same millisecond, the database will never serve the paste more times than allowed.

## 🏗 Notable Design Decisions

* **Next.js 15 & Promise Handling:** This project uses the latest Next.js 15. As per the new architecture, dynamic route parameters (`params`) are treated as Promises. The code explicitly awaits these params in both API routes and UI components to ensure stable rendering.
* **Server-Side Logic:** All sensitive logic (checking expiry, incrementing views) is handled securely on the server (API Routes) before returning data to the client.
* **Time Travel Logic:** A custom helper (`lib/time.ts`) injects the `x-test-now-ms` time into the expiry check only when `TEST_MODE=1` is set. This separates test logic from production logic while meeting the assignment's grading requirements.

## 📡 API Endpoints

### 1. Health Check
* **GET** `/api/healthz`
* **Returns:** `200 OK` `{ "ok": true }` if the database is connected.

### 2. Create Paste
* **POST** `/api/pastes`
* **Body:**
    ```json
    {
      "content": "Hello World",
      "ttl_seconds": 60,   // Optional
      "max_views": 5       // Optional
    }
    ```
* **Returns:** `{ "id": "...", "url": "..." }`

### 3. Get Paste
* **GET** `/api/pastes/:id`
* **Returns:** Paste content and metadata.
* **Errors:** Returns `404` if the paste is expired or the view limit is exceeded.

## 📂 Project Structure

```text
├── app/
│   ├── api/            # Backend API Routes
│   ├── p/[id]/         # View Paste Page (Dynamic Route)
│   └── page.tsx        # Create Paste Page (Home)
├── lib/
│   ├── db.ts           # MongoDB Connection Helper
│   └── time.ts         # Deterministic Time Helper
├── models/
│   └── Paste.ts        # Mongoose Data Schema
└── public/
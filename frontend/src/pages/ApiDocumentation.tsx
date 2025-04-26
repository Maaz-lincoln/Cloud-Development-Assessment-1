import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode } from "lucide-react";

export default function APIDocumentation() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary1 flex items-center gap-2">
        <FileCode className="h-8 w-8" />
        API Documentation
      </h1>
      <Card className="shadow-lg border-0 rounded-2xl transform transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary1 to-primary2 p-6">
          <CardTitle className="text-2xl font-semibold text-white">
            API Design and Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-primary1 mb-2">
              Introduction
            </h2>
            <p className="text-gray-700">
              This page explains the API design and architecture for my AI Text
              Summarizer application. The API connects the backend (where the
              processing happens) to the frontend (where users interact with the
              app). It handles things like user accounts, summarizing text, and
              sending notifications. Below, I’ll list all the API endpoints,
              show sample inputs and outputs, and explain how the system works.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary1 mb-2">
              API Endpoints
            </h2>
            <p className="text-gray-700">
              I built the API using FastAPI, and I wanted it to be simple and
              secure. Here’s a list of all the endpoints, what they do, and
              examples of inputs and outputs:
            </p>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              User Authentication
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>POST /auth/signup</strong>: Lets a new user create an
                account.
                <p className="mt-1">
                  <strong>Sample Input:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 max-w-full">
                  {`{
  "username": "sarah",
  "email": "sarah@example.com",
  "password": "pass123"
}`}
                </pre>
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                </pre>
                <p className="mt-1">
                  The API checks if the username or email is taken. If not, it
                  hashes the password and saves the user in the database. If the
                  username or email is already used, it returns an error:{" "}
                  <code>
                    {'{ "detail": "Username or email already exists" }'}
                  </code>
                  .
                </p>
              </li>
              <li>
                <strong>POST /auth/token</strong>: Lets a user log in.
                <p className="mt-1">
                  <strong>Sample Input:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "username": "sarah",
  "password": "pass123"
}`}
                </pre>
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                </pre>
                <p className="mt-1">
                  If the username or password is wrong, it returns:{" "}
                  <code>{'{ "detail": "Invalid username or password" }'}</code>.
                </p>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Credits Management
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>POST /credits/add</strong>: Adds 5 credits to the user’s
                account for testing.
                <p className="mt-1">
                  <strong>Sample Input:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "credits": 5
}`}
                </pre>
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "credits": 105
}`}
                </pre>
                <p className="mt-1">
                  Users need to include their token in the request header:{" "}
                  <code>
                    Authorization: Bearer
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                  .
                </p>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Job Submission and History
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>POST /jobs/submit</strong>: Lets a user submit text to
                be summarized.
                <p className="mt-1">
                  <strong>Sample Input:</strong>
                </p>
                <pre
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                  className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700"
                >
                  {`{
  "input_text": "Climate change is a major issue affecting the planet. Rising temperatures are causing ice caps to melt, leading to higher sea levels. This impacts coastal communities and wildlife. Scientists are working on solutions, but progress is slow due to lack of global cooperation."
}`}
                </pre>
                <p className="mt-1">
                  <strong>Sample Output (Initial):</strong>
                </p>
                <pre
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                  className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700"
                >
                  {`{
  "id": 1,
  "status": "pending",
  "created_at": "2025-04-25T10:00:00Z",
  "input_text": "Climate change is a major issue affecting the planet...",
  "output_text": null
}`}
                </pre>
                <p className="mt-1">
                  <strong>Sample Output (After Processing):</strong>
                </p>
                <pre
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                  className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700"
                >
                  {`{
  "id": 1,
  "status": "completed",
  "created_at": "2025-04-25T10:00:00Z",
  "input_text": "Climate change is a major issue affecting the planet...",
  "output_text": "Climate change causes rising temperatures, melting ice caps, and higher sea levels, impacting communities and wildlife."
}`}
                </pre>
                <p className="mt-1">
                  The API checks if the user has 10 credits, saves the job, and
                  uses the `facebook/bart-large-cnn` model to create a summary.
                  It needs the user’s token in the header.
                </p>
              </li>
              <li>
                <strong>GET /jobs/my</strong>: Shows all the user’s past jobs.
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`[
  {
    "id": 1,
    "status": "completed",
    "created_at": "2025-04-25T10:00:00Z",
    "input_text": "Climate change is a major issue affecting the planet...",
    "output_text": "Climate change causes rising temperatures, melting ice caps, and higher sea levels..."
  },
  {
    "id": 2,
    "status": "pending",
    "created_at": "2025-04-25T10:05:00Z",
    "input_text": "Technology is advancing rapidly, with AI playing a big role...",
    "output_text": null
  }
]`}
                </pre>
                <p className="mt-1">
                  If the user has no jobs, it returns an empty list:{" "}
                  <code>[]</code>. It needs the user’s token to make sure they
                  only see their own jobs.
                </p>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Notifications
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>GET /notifications</strong>: Shows all notifications for
                the user.
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`[
  {
    "id": 1,
    "message": "Job 1 completed successfully",
    "is_read": false,
    "created_at": "2025-04-25T10:00:00Z"
  },
  {
    "id": 2,
    "message": "Job 2 failed to process",
    "is_read": false,
    "created_at": "2025-04-25T10:05:00Z"
  }
]`}
                </pre>
                <p className="mt-1">
                  If there are no notifications, it returns: <code>[]</code>. It
                  needs the user’s token in the header.
                </p>
              </li>
              <li>
                <strong>POST /notifications/id/read</strong>: Marks a
                notification as read.
                <p className="mt-1">
                  <strong>Sample Input:</strong> A request to{" "}
                  <code>/notifications/1/read</code> (no body needed).
                </p>
                <p className="mt-1">
                  <strong>Sample Output:</strong>
                </p>
                <pre className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                  {`{
  "message": "Notification marked as read"
}`}
                </pre>
                <p className="mt-1">
                  If the notification doesn’t exist, it returns:{" "}
                  <code>{'{ "detail": "Notification not found" }'}</code>.
                </p>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Why I Designed the API This Way
            </h3>
            <p className="text-gray-700">
              I made the API RESTful so it’s easy to understand—using `POST` for
              creating things and `GET` for getting data. For security, I’m
              using JWT tokens, so users have to include a token in their
              requests to access their data. I’m storing everything in SQLite,
              set up with `sqlite+aiosqlite:///./app.db` to work asynchronously
              with FastAPI, which makes the API faster. I also added clear error
              messages, like telling a user they need more credits if they don’t
              have enough.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary1 mb-2">
              System Architecture
            </h2>
            <p className="text-gray-700">
              Here’s a diagram of how my system works:
            </p>
            <img
              className="mx-auto my-10 w-[35vw] object-contain"
              src="/images/arch.png"
              alt="architecture diagram"
            />
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Explanation of Each Part
            </h3>
            <p className="text-gray-700">
              - <strong>User:</strong> The person using the app, interacting
              through a web browser.
              <br />- <strong>Frontend (React Web App):</strong> The part the
              user sees, built with React and TypeScript. It has pages for
              signing up, logging in, submitting jobs, and more.
              <br />- <strong>Backend (FastAPI):</strong> Handles all the
              processing, like saving users and summarizing text.
              <br />- <strong>SQLite Database (Async):</strong> Stores data like
              users and jobs, set up with `sqlite+aiosqlite:///./app.db` for
              async operations.
              <br />- <strong>
                Hugging Face (facebook/bart-large-cnn):
              </strong>{" "}
              The AI model that creates summaries.
              <br />- <strong>Notifications:</strong> Messages saved in the
              database to tell the user about job updates.
            </p>
            <h3 className="text-lg font-semibold text-primary1 mt-4 mb-2">
              Data Flow Example
            </h3>
            <p className="text-gray-700">
              When a user submits a job, the frontend sends a `POST
              /jobs/submit` request with the text. The backend checks the user’s
              token, saves the job in the database, and sends the text to the
              `facebook/bart-large-cnn` model. The model creates a summary, the
              backend saves it, and makes a notification. The frontend shows the
              summary when it’s ready.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary1 mb-2">
              Design Justifications
            </h2>
            <p className="text-gray-700">
              I split the system into a frontend and backend to keep things
              organized. I used FastAPI because it’s fast and supports async
              operations, which works well with my SQLite database (set up for
              async with `sqlite+aiosqlite:///./app.db`). SQLite is great for a
              local project because it’s easy to set up. The
              `facebook/bart-large-cnn` model was a good choice because it’s
              pre-trained and gives good summaries.
            </p>
            <p className="mt-4 text-gray-700">
              For security, I’m using JWT tokens—users need to include a token
              in their requests to access their data. I also hash passwords
              before saving them in the database.
            </p>
            <p className="mt-4 text-gray-700">
              <strong>Future Improvements:</strong> If I made this app for lots
              of users, I’d switch to a database like PostgreSQL. I’d also add
              rate limiting to stop too many requests, and I could make the
              summarization faster by breaking long texts into smaller pieces.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

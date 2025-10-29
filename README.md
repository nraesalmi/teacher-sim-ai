# Special Needs Teacher AI Simulator

An interactive chatbot that lets users experience teaching a child with learning difficulties. Built with React TS, Node.js, Ollama API running llama2:7b​

Chatbot acts as a child with user set learning difficulties, achieved through prompt engineering​. The math problem that the child needs assistance with is randomly picked at the start of the session. 

Goal for the user is to adapt their problem explanations, provide encouragement, and correct misunderstandings​ according to the learning challenges of the child.

The project's goal is to evoke empathy by:​

- Showing the skills and patience required to teach children with learning difficulties​

- Letting the users understand the child's perspective and to experience their emotions​

At the end of the session, the user can receive feedback on their teaching performance.

---

Demo video:

[![Demo video](https://img.youtube.com/vi/vNvtB5wGitk/0.jpg)](https://youtu.be/vNvtB5wGitk)

---
>This README provides a quick overview and instructions to run the project locally and connect it to the AI backend.

## Quickstart

1. Clone the repo
   ```
   git clone https://github.com/nraesalmi/teacher-sim-ai.git
   cd teacher-sim-ai
   ```

2. Install dependencies
   - As the project uses Node: `npm install`

3. Environment variables
   - Create a `.env` file in the project root.
   - Add the required API endpoint variable. At minimum, the `.env` must contain:
     ```env
     APIENDPOINT=/api/generate
     ```
     >Note: The value for `APIENDPOINT` is the path used by the backend to send generation requests to the ollama server. It should contain `base-url/api/generate` exactly as shown.
     
4. Start the ollama server and endpoint

   - Start up the ollama service using `ollama serve`. The default endpoint of this is `http://localhost:11434`.
   - Pull the ollama model (by default, llama2:7b) to your device using `ollama pull llama2:7b`.
   - Run the model: `ollama run llama2:7b`
     >Note: If you are running the model in the same network but on a different device, before running the model, expose it by using your machine’s local IP, e.g.: `ollama serve --host 0.0.0.0`
   
6. Run the app
   - Using typical Node commands:
     ```
     npm run dev    # for development, run in root to utilize concurrently for running frontend and backend simultaneously.

     ```

## How to use

- Open the frontend at `http://localhost:5000`.
- The UI should send requests to the backend using the paths `http://localhost:5000/api/chat` and `http://localhost:5000/api/evaluate`.
- The backend sends requests to the running ollama server at `APIENDPOINT`


## Troubleshooting

- If requests fail with 404, ensure `APIENDPOINT` is correct and that your backend registers `/api/generate`.
- If CORS errors appear, either run frontend/backend on the same origin or enable CORS on the backend.
- If environment variables don't seem to be read by the client, ensure your build tooling injects `.env` variables into the client runtime or use a runtime-config approach.

## License

GNU GENERAL PUBLIC LICENSE

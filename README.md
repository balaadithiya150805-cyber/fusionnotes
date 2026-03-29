# FusionNotes

## Problem Statement
Students often take unstructured, context-dependent notes during fast-paced lectures, which become difficult to understand over time. This leads to inefficient revision, where learners spend more time re-learning than reinforcing concepts. At the same time, peer learning remains underutilized due to social hesitation, lack of suitable partners, and absence of structured collaboration systems. The disconnect between individual note-taking and collaborative learning results in poor knowledge retention, reduced engagement, and increased academic stress. A unified approach that bridges personal understanding with peer interaction is currently missing.

## Our Solution
FusionNotes is our context-aware collaborative learning platform that unifies individual note-taking with peer interaction. We built the system to act as an intelligent mediator, transforming unstructured, context-dependent personal notes into structured, high-retention group resources. Students no longer have to rely on disorganized materials or overcome social hesitation to benefit from peer knowledge; they simply upload their individual notes to a shared subject pool, and our application automatically synthesizes the collective input into a unified, accurate, and easily digestible master study guide.

## RAG System & Context-Aware Intelligence
At the core of our project is a Retrieval-Augmented Generation (RAG) system powered by Google Gemini 2.5 Flash, which we orchestrated via a FastAPI backend. When notes are uploaded (via images or PDFs), our OCR pipeline extracts the raw text. During synthesis, our RAG architecture retrieves relevant concepts from all peer-submitted materials within that subject, cross-references overlapping data, and generates a contextually accurate master guide that fills in individual knowledge gaps without hallucination.

## High-Fidelity Rendering & Additional Features
To handle complex subjects, we implemented specialized rendering technologies to preserve academic context. We engineered the platform to natively process mathematical formulas using KaTeX for scientific accuracy, and we generate structured Mermaid flowcharts to visualize biological processes or historical timelines directly within the generated master guide. We also provided offline frontend simulation capabilities for continuous UI access and rapid markdown rendering even when disconnected.

## Libraries & Technology Stack
We developed our solution on a scalable, open-source stack. To deliver a complete and robust application, we utilize the following core libraries:

- **React 18 & Vite:** For a highly responsive, fast-loading frontend architecture.
- **TypeScript:** To ensure strict type safety and a robust, maintainable codebase.
- **FastAPI (Python):** For rapid backend API orchestration and efficient file handling.
- **Google Generative AI SDK:** To power our RAG system, enabling Gemini 2.5 Flash for OCR and synthesis.
- **Supabase:** To fully manage our PostgreSQL database, secure JWT user authentication, and row-level security.
- **react-markdown & rehype-katex:** To natively render complex academic Markdown and mathematical LaTeX formulas.
- **mermaid-js:** To dynamically draw structured flowcharts and diagrams directly within the master guide.
- **Lucide React:** For beautifully consistent, lightweight scalar vector icons.

## Testing & Local Setup
To run and test our full application logic locally:
```bash
# 1. Start our FastAPI backend
cd hack
python -m venv venv
venv\Scripts\activate  # or 'source venv/bin/activate' on Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 3000

# 2. Start our Vite React frontend (in a new terminal split)
cd app
npm install
npm run dev
```
Once both servers are running, access the frontend at `http://localhost:5173`. We configured the application to proxy requests natively to the backend via port 3000, enabling our secure drag-and-drop OCR and Master Guide synthesis generation.
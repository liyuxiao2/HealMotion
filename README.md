<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="README for Heal Motion - A Personal Fitness and Rehabilitation Assistant">
    <title>Heal Motion - README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f7f9fc;
        }
        header {
            background: #1a1a2e;
            color: #fff;
            padding: 20px 0;
            text-align: center;
        }
        header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        header p {
            margin: 5px 0;
            font-size: 1.2em;
            color: #35b7e3;
        }
        main {
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        section {
            margin-bottom: 20px;
        }
        h2 {
            color: #1a1a2e;
            border-bottom: 2px solid #35b7e3;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        ul {
            list-style-type: disc;
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: Consolas, 'Courier New', monospace;
        }
        footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <header>
        <h1>Heal Motion</h1>
        <p>Your Personal Fitness and Rehabilitation Assistant</p>
    </header>
    <main>
        <section>
            <h2>About Heal Motion</h2>
            <p>Heal Motion is a modern fitness and rehabilitation application designed to help users manage recovery and achieve fitness goals. It integrates React for the frontend and Flask (with Gemini API integration) for personalized plans.</p>
        </section>
        <section>
            <h2>Features</h2>
            <ul>
                <li><strong>Profile Management:</strong> Manage personal information such as age, height, weight, and fitness goals.</li>
                <li><strong>Workout Plans:</strong> Receive customized 7-day workout plans tailored to injuries or goals.</li>
                <li><strong>Diet Recommendations:</strong> Get personalized dietary plans for recovery and training.</li>
                <li><strong>Interactive Design:</strong> Modals and responsive grids for an intuitive user experience.</li>
            </ul>
        </section>
        <section>
            <h2>Technologies Used</h2>
            <ul>
                <li><strong>Frontend:</strong> React</li>
                <li><strong>Backend:</strong> Flask, Gemini API</li>
                <li><strong>State Management:</strong> React Hooks</li>
            </ul>
        </section>
        <section>
            <h2>Getting Started</h2>
            <h3>1. Backend Setup</h3>
            <pre>
cd backend
pip install -r requirements.txt
python app.py
            </pre>
            <p>The Flask server runs at <code>http://127.0.0.1:5000</code>.</p>
            <h3>2. Frontend Setup</h3>
            <pre>
cd frontend
npm install
npm start
            </pre>
            <p>The React app runs at <code>http://localhost:3000</code>.</p>
        </section>
        <section>
            <h2>Folder Structure</h2>
            <pre>
HealMotion/
├── backend/                # Backend folder for Flask app
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
├── frontend/               # Frontend folder for React
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Profile, Workout, and Diet pages
│   │   ├── App.js          # Main React application
│   │   └── index.js        # React entry point
│   ├── public/             # Public folder for static assets
│   └── package.json        # Frontend dependencies
└── README.html             # Project documentation
            </pre>
        </section>
        <section>
            <h2>Contact</h2>
            <p>For any issues or suggestions, please contact <a href="mailto:liyuxiao2006@gmail.com">liyuxiao2006@gmail.com</a>.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Heal Motion. All rights reserved.</p>
    </footer>
</body>
</html>

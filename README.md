
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

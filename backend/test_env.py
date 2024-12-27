from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Environment is set up successfully!"

if __name__ == '__main__':
    app.run(debug=True)

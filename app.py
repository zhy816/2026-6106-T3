from flask import Flask,render_template,request
app = Flask(__name__)

@app.route("/",methods=["GET","POST"])
def index():
    return(render_template("index.html"))

@app.route("/main",methods=["GET","POST"])
def main():
    return(render_template("main.html"))

@app.route("/TransferMoney",methods=["GET","POST"])
def TransferMoney():
    return(render_template("TransferMoney.html"))

@app.route("/depositMoney",methods=["GET","POST"])
def depositMoney():
    return(render_template("depositMoney.html"))

if __name__ == "__main__":
    app.run()



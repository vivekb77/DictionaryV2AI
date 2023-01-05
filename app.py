
import openai


from flask import Flask, render_template ,request
app = Flask(__name__)


openai.api_key = "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"

@app.route('/')
def ai():
    return render_template('ai.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/askAI',methods = ['POST','GET'])
def callPythonScriptPA():
    # requirement send from js
    requirement = request.args.get('requirement')
    temperature = float(request.args.get('temperature'))

    outputTestCases = openai.Completion.create(
    model="text-davinci-003",
    prompt=requirement,
    temperature=temperature,
    max_tokens=200,
    top_p=1,
    frequency_penalty=0.0,
    presence_penalty=0.0
    )

    return outputTestCases


if __name__ == '__main__':
    app.run(debug=True)


#The content filter flags text that may violate our content policy. It's powered by our moderation endpoint which is free to use to moderate your OpenAI API traffic. 

@app.route('/moderateContent',methods = ['POST','GET'])
def contentModeration():

    requirement = request.args.get('requirement')

    isRequestBad = openai.Moderation.create(
    input= requirement
    )
    # print (isRequestBad)
    return isRequestBad

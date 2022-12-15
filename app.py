import os
import openai
from dotenv import load_dotenv
load_dotenv()



from flask import Flask, render_template ,request, redirect, session
app = Flask(__name__)


#openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = "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"



@app.route('/ContactUs')
def ContactUs():
    return render_template('contact.html')

@app.route('/TermsOfService')
def TermsOfService():
    return render_template('TermsOfService.html') 

@app.route('/PrivacyPolicy')
def PrivacyPolicy():
    return render_template('PrivacyPolicy.html')

@app.route('/UsageGuidelines')
def UsageGuidelinesguidelines():
    return render_template('UsageGuidelines.html')        


# all code for personal assistant

@app.route('/')
def ai():
    return render_template('ai.html')

@app.route('/askAI',methods = ['POST','GET'])
def callPythonScriptPA():
    # requirement send from js
    requirement = request.args.get('requirement')


    outputTestCases = openai.Completion.create(
    model="text-davinci-003",
    prompt=requirement,
    temperature=0,
    max_tokens=5,
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

#monitor the response for flagged = true and do not show output
# {
#   "id": "modr-XXXXX",
#   "model": "text-moderation-001",
#   "results": [
#     {
#       "categories": {
#         "hate": false,
#         "hate/threatening": false,
#         "self-harm": false,
#         "sexual": false,
#         "sexual/minors": false,
#         "violence": false,
#         "violence/graphic": false
#       },
#       "category_scores": {
#         "hate": 0.18805529177188873,
#         "hate/threatening": 0.0001250059431185946,
#         "self-harm": 0.0003706029092427343,
#         "sexual": 0.0008735615410842001,
#         "sexual/minors": 0.0007470346172340214,
#         "violence": 0.0041268812492489815,
#         "violence/graphic": 0.00023186142789199948
#       },
#       "flagged": false
#     }
#   ]
# }
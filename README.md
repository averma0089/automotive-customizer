# AutoMarket — simple car sales website

This commit adds a small Express + EJS website with a Homepage, Shop, and Checkout pages, plus a Dockerfile so the app can be deployed as a container (suitable for AWS Elastic Beanstalk Docker platform).

How to run locally:

1. Install dependencies

   npm install

2. Start the app

   npm start

3. Open http://localhost:8080

Docker (build & run):

   docker build -t automarket .
   docker run -p 8080:8080 automarket

Deploy to Elastic Beanstalk (high-level):

1. Install and configure the EB CLI (https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
2. eb init -p docker
3. eb create automarket-env
4. eb deploy

Notes:
- This is a demo app: no database, and payment handling is mocked. For production, add persistent storage, proper secrets management, and a payment provider.

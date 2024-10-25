# AWS CLOUD RESUME CHALLENGE
Building My Cloud Resume Website on AWS: A Journey Through Console Configurations and CI/CD

Welcome to my AWS Cloud Resume Project! This project was a hands-on dive into AWS Console, OpenID Connect (OIDC), and CI/CD using GitHub Actions. The objective of this project is for me to learn more about AWS. I wanted to create a resume website that is secure, globally distributed, and fully automated using cloud services and Infrastructure as Code (IaC) principles.

Here’s how I approached each part of the project, from S3 hosting to CI/CD deployment automation.

# Project Inspiration

I took on this project as part of the Cloud Resume Challenge, a perfect opportunity to explore AWS services while building something personal and practical. My goal was to create a resume website that tracks visitor views and is deployed automatically. Using only the AWS Console, I wanted to go hands-on with each service setup while keeping the deployment pipeline in GitHub for easy version control and automation.

# Project Goals

	1.	Host a static resume site on AWS S3, using CloudFront and Route 53 for global access and custom domain configuration.
	2.	Add a visitor counter to track page views stored in a DynamoDB table.
	3.	Automate deployments using GitHub Actions with OpenID Connect (OIDC) for a secure and efficient CI/CD pipeline.

# Building the Architecture

I broke down the architecture using several AWS services to build a low-cost, highly scalable solution. Here’s how each component came together:

Step 1: Static Website on S3

Using AWS S3 was a no-brainer. S3 is a simple, cost-effective solution for hosting static websites. After setting up the bucket, I configured it for static website hosting and uploaded my resume files, including HTML, CSS, and JavaScript.

Challenge: Setting up HTTPS required linking CloudFront as a content delivery network (CDN). CloudFront not only distributes the content but also handles SSL, this step involved managing certificates with AWS Certificate Manager (ACM) to ensure the site was secure.

Step 2: Domain Setup with Route 53

Since I wanted a custom domain, I used AWS Route 53 for DNS management. This setup involved:

	•	Registering the domain in Route 53.
	•	Creating an A record to link the domain to the CloudFront distribution.

With Route 53, I gained control over DNS configurations, and once the domain was linked with CloudFront, my resume site was accessible over HTTPS.

Step 3: Creating a View Counter with DynamoDB and Lambda

I wanted a counter to track the number of visitors to my site, and DynamoDB was ideal for this. It’s fully managed, serverless, and scales as needed.

Then came AWS Lambda to automate the count. Each time someone visits the site, Lambda increments the view counter stored in DynamoDB. Here’s how I set it up:

	1.	Created a Lambda function to handle the logic for updating the count.
	2.	Configured API Gateway to provide an endpoint for the front end to trigger Lambda.

Challenge: Managing cross-origin resource sharing (CORS) in API Gateway required careful configuration. Adding custom headers ensured the frontend could securely access the view counter data without issues.

Step 4: Automating with GitHub Actions and OpenID Connect (OIDC)

The CI/CD pipeline was crucial for this project’s maintainability. I set up GitHub Actions to automatically deploy updates whenever changes were committed to the GitHub repository. With OIDC as the authentication method, I avoided using long-term access keys, making the connection between GitHub and AWS both secure and straightforward.

# How It Works:

	1.	GitHub Actions triggers on each commit to the main branch.
	2.	OpenID Connect allows GitHub to assume an AWS role, securely connecting GitHub Actions with AWS without requiring access keys.
	3.	The workflow syncs the latest files to the S3 bucket and updates the Lambda function.

# GitHub Actions Workflow Example
```
name: Deploy Resume Project

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Configure AWS Credentials with OIDC
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/YOUR_ROLE_NAME
          aws-region: us-east-1

      - name: Sync S3 Bucket
        run: |
          aws s3 sync . s3://YOUR_S3_BUCKET_NAME --delete

      - name: Update Lambda Function
        run: |
          zip function.zip lambda_function.py
          aws lambda update-function-code --function-name YOUR_LAMBDA_FUNCTION_NAME --zip-file fileb://function.zip

``` 

# Lessons Learned

Using OpenID Connect (OIDC) for Secure CI/CD

OIDC was a game-changer, eliminating the need for long-term AWS keys. With GitHub Actions and AWS IAM role configurations, the pipeline became both secure and easy to manage.

# Going Serverless with AWS

Setting up Lambda and DynamoDB as serverless services made the view counter implementation both scalable and cost-effective. I learned a lot about CORS and lambda integration with serverless applications.

# Hands-on with AWS Console

Configuring each component through the AWS Console gave me a deeper understanding of each service’s settings and nuances. The Console approach provided great insight into managing configurations visually and how each part fits together.

# Future Enhancements

I’m excited to build on this project and have a few ideas for improvements:

	•	Analytics: Adding more detailed analytics, such as tracking unique visitors.
	•	Error Logging: Improving Lambda logging for better debugging and error tracking.
	•	Frontend Update: Refreshing the UI with a more dynamic design.
    •	Infrastructure as Code: Implementing IaC / Terraform for better automation and less ClickOps
    
# Conclusion

Building this resume website has been an excellent learning experience, combining cloud infrastructure, serverless computing, and CI/CD automation. I now have a resume that not only shows my skills but was also built to demonstrate them in action.

Thanks for following along, and feel free to check out the code, leave feedback, or reach out if you’re interested in replicating this setup!

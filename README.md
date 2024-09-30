# AWS CLOUD RESUME CHALLENGE
If you’re like me, learn by watching/reading doesn’t really click for learning. I learned best by doing, trial by fire. And the Cloud Resume Challenge was an awesome way to learn about AWS since I had no prior experience to it. The first step in tackling the AWS Cloud Resume Challenge is to design and develop your resume website. For this project, I chose to utilize HTML, JavaScript, and CSS to craft a visually appealing and interactive resume. Since I don't have much expertise in web development, I opt to use a template I found online from designstub.com

# Leveraging AWS Services
S3
Route 53
Cloudfront
DynamoDB
Lambda

Github Actions
OpenID Connect Authentication
Any multifactor authentication app (Microsoft Authenticator, Google Authenticator etc)

# Amazon S3
Lets start with Amazon S3. Amazon S3, or Simple Storage Service, is a scalable object storage service provided by Amazon Web Services (AWS). It allows users to store and retrieve any amount of data from anywhere on the web. S3 is commonly used for data backup, archival, and as a storage solution for web applications. Amazon S3 is a storage Amazon S3 served as the foundation for hosting my resume website. I uploaded the HTML, JavaScript, and CSS files to an S3 bucket, making them accessible to users over the internet

# Automating Deployment with GitHub Actions
Maintaining and updating the resume website was made effortless thanks to GitHub Actions. I set up continuous integration and deployment pipelines using GitHub Actions, allowing changes pushed to the GitHub repository to automatically trigger deployment to AWS services. This streamlined the development process and ensured that the resume website was always up-to-date.

Originally I used github secrets to store my AWS access and secret keys but even though that is more secure than hard coding the secret keys, a better approach is to utilize a federated idenity. This is where OpenID Connect comes in.

# Securing with OpenID
OpenID Connect (OIDC) allows your GitHub Actions workflows to access resources in Amazon Web Services (AWS), without needing to store the AWS credentials as long-lived GitHub secrets.

Security was a top priority throughout the AWS Cloud Resume Challenge. To safeguard sensitive data and restrict access to authorized users, I implemented OpenID Connect (OIDC) authentication. By integrating OIDC with AWS Identity and Access Management (IAM), I enforced secure authentication and authorization mechanisms, protecting both the website and its backend resources from unauthorized access.

# Route 53
Now that we got our bucket up with CI/CD to update the front end of the website, I had to set up a domain so people can actually reach my website. For this, I used Route 53.

Amazon Route 53 is a scalable and highly available Domain Name System (DNS) web service provided by Amazon Web Services (AWS). It effectively translates human-friendly domain names (like www.example.com) into IP addresses (like 192.0.2.1) that computers use to identify each other on the network.

# CloudFront
Once the domain is up and running, we can move on to the next step which is Cloudfront. Cloudfront will allow us to connect our S3 bucket to our domain which allows public access. Cloudfront enhance the performance and security of my website. Since its a CDN, it cachedsmy website's content at edge locations worldwide, ensuring fast and reliable access for users across the globe. Cloudfront limits access to S3 buckets and their contents to only CloudFront and the operations it performs as well as enforcing HTTPS-only access which encrypts data in traffic.

# DynamoDB
For dynamic content on my resume website, such as visitor count, I integrated Amazon DynamoDB, a fully managed NoSQL database service. DynamoDB stored and retrieved data seamlessly, adding interactivity to the static resume website. I created a table called resume-views then I created the table item to store the views. After creating the table, you need to connect with a lambda function for the backend and javascript for the frontend.

# Lambda Function
To handle backend logic and dynamic content generation, I utilized AWS Lambda, a serverless compute service. I wrote Lambda functions in python to interact with DynamoDB to interact with the resume website's view counter.

# Conclusion
The AWS Cloud Resume Challenge provided a hands-on opportunity to showcase my skills in cloud computing and web development. By leveraging various AWS services and best practices, I successfully built and deployed a dynamic resume website that not only highlights my professional achievements but also demonstrates my proficiency in cloud technologies.


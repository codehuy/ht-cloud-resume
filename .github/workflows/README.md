# CLOUD RESUME CHALLENGE



# AWS Cloud Resume
If you’re like me, learn by watching/reading doesn’t really click for learning. I learned best by doing, trial by fire. And the Cloud Resume Challenge was an awesome way to learn about AWS since I had no prior experience to it. The first step in tackling the AWS Cloud Resume Challenge is to design and develop your resume website. For this project, I chose to utilize HTML, JavaScript, and CSS to craft a visually appealing and interactive resume. Since I don't have much expertise in web development, I opt to use a template I found online from designstub.com


Quick tip: make sure download the extension “Live Server” inside VS Code to easily help update/troubleshoot the website locally. It enables a live reload of your website so you can actively see the changes you made to your html and css files. Once the website was ready, it was time to bring it to life using AWS services.

# Leveraging AWS Services
S3
Route 53
Cloudfront
DynamoDB
Lambda
Other Services
Github Actions
OpenID Connect Authentication
Any multifactor authentication app (Microsoft Authenticator, Google Authenticator etc)
Before we begin, we want to make sure our account is set up properly and secure. After I created the account, the first thing I did was securing it with MFA so only I can access it. You can find this in security credentials under account page.

Once the account is secure , you want to create an IAM user (Identity and Access Management). Using IAM (Identity and Access Management) roles instead of the AWS root account is crucial for security and best practices such as least priviledge principles and audit/monitoring purposes. AWS recommends using the root account only for tasks that require it, such as setting up your account. For everyday tasks, always use IAM roles or users.

I start by creating a user group called Admins and gave that group full access then i created a user called Captain and assign it to that group. I also attached the AdministorAccess policy as that is needed to create the various aws resources for this project.

After creating the user, i also created 2FA for the user account by setting up an MFA code with the authenticator app. I then signed into the user account and will doing all provisioning with it and not the root account , following AWS best practices.

Before we get started on setting up the various AWS services, I had to initiate the billing alarms on cloudwatch. You can find this by searching for cloudwatch and creating the alarms that way. I set the alarm to notify my email for anything above $10. I seen on the internet where there was horror story of people who got charge exorbitant amount cause they left unused AWS service running or did not secure their account and it got compromised. The billing alarms as well as the security MFA should prevent this.

# Amazon S3
Lets start with Amazon S3. Amazon S3, or Simple Storage Service, is a scalable object storage service provided by Amazon Web Services (AWS). It allows users to store and retrieve any amount of data from anywhere on the web. S3 is commonly used for data backup, archival, and as a storage solution for web applications. Amazon S3 is a storage Amazon S3 served as the foundation for hosting my resume website. I uploaded the HTML, JavaScript, and CSS files to an S3 bucket, making them accessible to users over the internet

Now that the files are uploaded, what happens when you want to update your site? Constantly reuploading files will be a pain so thats why CI/CD is a must for this.

# Automating Deployment with GitHub Actions
Maintaining and updating the resume website was made effortless thanks to GitHub Actions. I set up continuous integration and deployment pipelines using GitHub Actions, allowing changes pushed to the GitHub repository to automatically trigger deployment to AWS services. This streamlined the development process and ensured that the resume website was always up-to-date.

You first start by connecting your local repo by creating a .github/workflows folder and within that folder you create a yaml file.

                                    name: S3 Website
                                    on:
                                      workflow_dispatch:
                                      push:
                                        branches:
                                        - main
                                    
                                    jobs:
                                      deploy:
                                        runs-on: ubuntu-latest
                                        steps:
                                        - uses: actions/checkout@master
                                        - uses: jakejarvis/s3-sync-action@master
                                          with:
                                            args: --acl private --follow-symlinks --delete
                                          env:
                                            AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
                                            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
                                            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                                            AWS_REGION: 'us-east-1'
                                            SOURCE_DIR: 'website'
                                                               
This was my initial yaml setup. I set S3 bucket and access key/ids as secrets which is stored inside the Github repo. You can find this setting by going to the repo then settings > secrets and variables.

Afterwards , I commit the changes I’ve made through the terminal then navigate back to the repo on github.com and you can see the workflow run. I verified everything work by going back to the AWS console and confirming the changes and different files that was push to my bucket.

Originally I used github secrets to store my AWS access and secret keys but even though that is more secure than hard coding the secret keys, a better approach is to utilize a federated idenity. This is where OpenID Connect comes in.

# Securing with OpenID
OpenID Connect (OIDC) allows your GitHub Actions workflows to access resources in Amazon Web Services (AWS), without needing to store the AWS credentials as long-lived GitHub secrets.

Security was a top priority throughout the AWS Cloud Resume Challenge. To safeguard sensitive data and restrict access to authorized users, I implemented OpenID Connect (OIDC) authentication. By integrating OIDC with AWS Identity and Access Management (IAM), I enforced secure authentication and authorization mechanisms, protecting both the website and its backend resources from unauthorized access.

Then I created the IAM role that I associate the role with the web identity token.

Afterwards I updated the yaml file with the role and deleted the embedded secrets. With that, I was able to delete the secrets within Github and push my commit through. I verified it was working by checking the different changes i made inside the S3 bucket via the AWS consoles.

# Route 53
Now that we got our bucket up with CI/CD to update the front end of the website, I had to set up a domain so people can actually reach my website. For this, I used Route 53.

Amazon Route 53 is a scalable and highly available Domain Name System (DNS) web service provided by Amazon Web Services (AWS). It effectively translates human-friendly domain names (like www.example.com) into IP addresses (like 192.0.2.1) that computers use to identify each other on the network.

With Route 53, i was able to register a domain name for my website. And it was cheap , only $12/yr. The most surprising part of this was that I was able to secure my full name for the website domain as well. Now users can just type my name (with the dash) in the browser and my website should appear.

# CloudFront
Once the domain is up and running, we can move on to the next step which is Cloudfront. Cloudfront will allow us to connect our S3 bucket to our domain which allows public access. Cloudfront enhance the performance and security of my website. Since its a CDN, it cachedsmy website's content at edge locations worldwide, ensuring fast and reliable access for users across the globe. Cloudfront limits access to S3 buckets and their contents to only CloudFront and the operations it performs as well as enforcing HTTPS-only access which encrypts data in traffic.

During the process of creating the CDN, its important to go with the OAC (recommended origin access control) and select your bucket. It restricts access to only Cloudfront.

You also need to request SSL certificate from the certificate manager within AWS. The SSL/TLS certificates are needed to encrypt data as well as authentication for the CDN, ensuring that users are communicating with a legiminate website. After the SSL certificate has been created, it has to be associated with Cloudfront.

After the creation of it, you need to go back and copy the policy and paste into the bucket policy under permission tab within your S3 bucket. This will grant cloudfront to access the contents of your bucket.

The last step to this is to make sure invalidate your CloudFront cache. This way any user who try to reach your website will always have the latest version. Within Cloudfront it is within the invalidation tab. I did the wildcard /* for all paths within my bucket.

# DynamoDB
For dynamic content on my resume website, such as visitor count, I integrated Amazon DynamoDB, a fully managed NoSQL database service. DynamoDB stored and retrieved data seamlessly, adding interactivity to the static resume website. I created a table called resume-views then I created the table item to store the views. After creating the table, you need to connect with a lambda function for the backend and javascript for the frontend.


# Lambda Function
To handle backend logic and dynamic content generation, I utilized AWS Lambda, a serverless compute service. I wrote Lambda functions in python to interact with DynamoDB to interact with the resume website's view counter.

# Conclusion
The AWS Cloud Resume Challenge provided a hands-on opportunity to showcase my skills in cloud computing and web development. By leveraging various AWS services and best practices, I successfully built and deployed a dynamic resume website that not only highlights my professional achievements but also demonstrates my proficiency in cloud technologies.
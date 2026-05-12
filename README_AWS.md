# AWS CI/CD Setup Guide

This project is configured with a `buildspec.yml` file and is ready to be deployed using AWS services. Follow this guide to set up your pipeline.

## Prerequisites
1. An AWS Account.
2. AWS CLI installed and configured locally (optional but helpful).

## Step 1: Push Code to AWS CodeCommit
Instead of GitHub, you can use AWS CodeCommit to store your code.

1. Open the **AWS CodeCommit** console.
2. Click **Create repository**. Name it `HabitTracker`.
3. Set up your Git credentials for CodeCommit (IAM -> Users -> Your User -> Security Credentials -> Git credentials for AWS CodeCommit).
4. Add the CodeCommit remote to your local repository and push:
   ```bash
   git remote add aws <your-codecommit-url>
   git push aws main
   ```

## Step 2: Configure AWS CodeBuild
CodeBuild will use the `buildspec.yml` file in the root of the project to build the frontend and package the application.

1. Open the **AWS CodeBuild** console.
2. Click **Create build project**.
3. **Source**: Select AWS CodeCommit and your repository.
4. **Environment**: 
   - Managed image: Amazon Linux 2 or Ubuntu.
   - Runtime: Standard.
   - Image: Latest available.
5. **Environment Variables**: **[CRITICAL]** Add the following variables here:
   - `VITE_SUPABASE_URL` = (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon Key)
   - `SUPABASE_JWT_SECRET` = (Your Supabase JWT Secret)
6. **Buildspec**: Select "Use a buildspec file" (it will automatically find `buildspec.yml`).

## Step 3: Create AWS CodePipeline
CodePipeline will automate the flow from code change to build.

1. Open the **AWS CodePipeline** console.
2. Click **Create pipeline**.
3. **Source**: Select AWS CodeCommit, your repository, and branch `main`.
4. **Build**: Select AWS CodeBuild and the project you created in Step 2.
5. **Deploy**: You can skip this for now or select a deployment target like AWS Elastic Beanstalk (for the backend) or AWS S3 (for the static frontend).

## Note on Architecture
Since this is a full-stack app with a Node.js backend and a React frontend:
- The **Frontend** (`dist` folder) is static and can be hosted on **AWS S3** with CloudFront.
- The **Backend** (`server` folder) needs a Node.js environment like **AWS Elastic Beanstalk** or an **EC2 instance**.

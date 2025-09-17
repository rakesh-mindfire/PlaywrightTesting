pipeline {
    agent any
    
    options {
        // This is the key. It prevents the default declarative checkout
        // so you can control it yourself.
        skipDefaultCheckout()
    }
    
    environment {
        NPM_CACHE_DIR = "C:\\JenkinsCache\\npm\\${env.JOB_NAME}"
        PLAYWRIGHT_CACHE_DIR = "${env.USERPROFILE}\\.cache\\ms-playwright"
    }
    
    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['test', 'staging'],
            description: 'Select the environment for testing.'
        )
    }

    stages {
        stage('Clean Workspace and Checkout') {
            steps {
                script {
                    // Use cleanWs to ensure the workspace is completely empty
                    // before the git clone.
                    cleanWs(
                        cleanWhenFailure: true,
                        deleteDirs: true,
                        notFailBuild: true
                    )
                }
                // Now perform the checkout
                git branch: 'Rakesh', url: 'https://github.com/rakesh-mindfire/PlaywrightTesting.git'
            }
        }
        
        stage('Setup Cache Directory') {
            steps {
                bat """
                    if not exist "C:\\JenkinsCache" mkdir "C:\\JenkinsCache"
                    if not exist "${NPM_CACHE_DIR}" mkdir "${NPM_CACHE_DIR}"
                    dir "C:\\JenkinsCache"
                """
            }
        }

        stage('Clear Cache if Dependencies Changed') {
            // ... The updated stage from the previous conversation.
            // Copy and paste the corrected code here.
        }

        stage('Restore Cache') {
            // ...
        }

        stage('Install Dependencies') {
            // ...
        }

        stage('Install Playwright') {
            // ...
        }

        stage('Save Cache') {
            // ...
        }

        stage('Execute Test Cases') {
            // ...
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            publishHTML(target: [
                reportName: 'Allure Report',
                reportDir: 'allure-report',
                reportFiles: 'index.html',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            // It's good practice to do a final cleanup at the end.
            cleanWs(
                notFailBuild: true, 
                patterns: [
                    [pattern: 'C:\\JenkinsCache\\**', type: 'EXCLUDE'], 
                    [pattern: "${env.USERPROFILE}\\.cache\\ms-playwright\\**", type: 'EXCLUDE']
                ]
            )
        }
    }
}
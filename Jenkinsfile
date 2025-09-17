pipeline {
    agent any
    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['test', 'staging'],
            description: 'Select the environment for testing.'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'Rakesh', url: 'https://github.com/rakesh-mindfire/PlaywrightTesting.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Installs Node.js dependencies
                bat 'npm install'
                // Installs Allure Playwright reporter
                bat 'npm install allure-playwright --save-dev'
            }
        }
        stage('Install Allure CLI') {
            steps {
                bat 'npm install allure-commandline --save-dev'
            }
        }

        stage('Install Playwright') {
            steps {
                // Installs Playwright browsers and dependencies
                bat 'npx playwright install --with-deps'
            }
        }

 
    stage('Execute Test Cases') {
        steps {
            script {
                def envFileId
                if ("${params.TEST_ENV}" == 'staging') {
                    envFileId = 'staging_env_file'
                } else if ("${params.TEST_ENV}" == 'prod') {
                    envFileId = 'prod_env_file'
                } else {
                    envFileId = 'test_env_file'
                }

                withCredentials([file(credentialsId: envFileId, variable: 'ENV_FILE_PATH')]) {
                    // This command reads the file content and injects it as env vars
                    def props = readProperties(file: ENV_FILE_PATH)
                    
                    // Now, run the tests by passing each property as an environment variable
                    withEnv([
                        "BASE_URL=${props.BASE_URL}",
                        "ADMIN_USERNAME=${props.ADMIN_USERNAME}",
                        "ADMIN_PASSWORD=${props.ADMIN_PASSWORD}"
                    ]) {
                        bat "npx playwright test --reporter=line,allure-playwright"
                    }
                }
            }
        }
    }


        // stage('Generate Allure Report') {
        //     steps {
        //         // Generates the Allure report using npx, which finds the allure CLI
        //         // installed locally by the npm command
        //         bat '"npx allure generate allure-results --clean -o allure-report"'
        //     }
        // }
    }

    post {
        always {
            // Publish Allure report using the Allure Jenkins Plugin
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            // Fallback to publishHTML if needed
            publishHTML(target: [
                reportName: 'Allure Report',
                reportDir: 'allure-report',
                reportFiles: 'index.html',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            cleanWs()
        }
    }
}

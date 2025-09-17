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
                // Cache node_modules based on package-lock.json
                cache(path: 'node_modules', key: "npm-cache-${env.JOB_NAME}-${hashFiles('**/package-lock.json')}") {
                    bat 'npm ci'
                }
            }
        }

        stage('Install Playwright') {
            steps {
                // Cache Playwright browser binaries
                cache(path: "${env.HOME}/.cache/ms-playwright", key: "playwright-cache-${env.JOB_NAME}-${env.PLAYWRIGHT_VERSION ?: 'latest'}") {
                    bat 'npx playwright install --with-deps'
                }
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
                        // Read the file content and inject it as env vars
                        def props = readProperties(file: ENV_FILE_PATH)
                        
                        // Run the tests by passing each property as an environment variable
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
            cleanWs()
        }
    }
}
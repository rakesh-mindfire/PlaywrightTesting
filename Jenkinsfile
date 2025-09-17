pipeline {
    agent any
    
    // We keep skipDefaultCheckout() to maintain full control of the workspace.
    options {
        skipDefaultCheckout()
    }
    
    environment {
        // We still need this for the test execution stage
        // but the cache directories are no longer used.
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
                    // This step is critical to ensure a fresh start on every build.
                    cleanWs(
                        cleanWhenFailure: true,
                        deleteDirs: true,
                        notFailBuild: true
                    )
                }
                git branch: 'Rakesh', url: 'https://github.com/rakesh-mindfire/PlaywrightTesting.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies from scratch...'
                // npm ci is the best choice for CI as it uses the package-lock.json
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                echo 'Installing Playwright browsers and dependencies...'
                // This command will download browsers every time
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
                        def props = readProperties(file: ENV_FILE_PATH)
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
            // Final cleanup to ensure the next build is completely fresh.
            cleanWs(
                notFailBuild: true
            )
        }
    }
}
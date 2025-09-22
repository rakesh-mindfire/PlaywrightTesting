pipeline {
    agent any
    
    environment {
        // Define cache directory in workspace (Windows-compatible)
        CACHE_DIR = "${env.WORKSPACE}\\.npm-cache"
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
                    cleanWs(
                        cleanWhenFailure: true,
                        deleteDirs: true,
                        notFailBuild: true
                    )
                }
                git branch: 'Rakesh', url: 'https://github.com/rakesh-mindfire/PlaywrightTesting.git'
            }
        }

        stage('Restore Cache') {
            steps {
                // Restore node_modules, npm cache, and Playwright browsers if they exist
                bat '''
                    if exist "%CACHE_DIR%\\node_modules" (
                        xcopy /E /I /Y "%CACHE_DIR%\\node_modules" "%WORKSPACE%\\node_modules"
                    )
                    if exist "%CACHE_DIR%\\.npm" (
                        xcopy /E /I /Y "%CACHE_DIR%\\.npm" "%USERPROFILE%\\.npm"
                    )
                    if exist "%CACHE_DIR%\\ms-playwright" (
                        xcopy /E /I /Y "%CACHE_DIR%\\ms-playwright" "%USERPROFILE%\\.cache\\ms-playwright"
                    )
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                // Use npm ci for CI environments
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                echo 'Installing Playwright browsers and dependencies...'
                bat 'npx playwright install --with-deps'
            }
        }
stage('Save Cache') {
            steps {
                // Save node_modules, npm cache, and Playwright browsers
                bat '''
                    mkdir "%CACHE_DIR%" || exit /b 0
                    xcopy /E /I /Y "%WORKSPACE%\\node_modules" "%CACHE_DIR%\\node_modules"
                    if exist "%USERPROFILE%\\.npm" (
                        xcopy /E /I /Y "%USERPROFILE%\\.npm" "%CACHE_DIR%\\.npm"
                    )
                    if exist "%USERPROFILE%\\.cache\\ms-playwright" (
                        xcopy /E /I /Y "%USERPROFILE%\\.cache\\ms-playwright" "%CACHE_DIR%\\ms-playwright"
                    )
                '''
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
            cleanWs(
                notFailBuild: true
            )
        }
    }
}
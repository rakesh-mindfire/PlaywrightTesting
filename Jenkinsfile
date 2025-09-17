pipeline {
    agent any
    environment {
        // Define persistent cache directories outside workspace
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
        stage('Setup Cache Directory') {
            steps {
                // Ensure cache directory exists
                bat """
                    if not exist "C:\\JenkinsCache" mkdir "C:\\JenkinsCache"
                    if not exist "${NPM_CACHE_DIR}" mkdir "${NPM_CACHE_DIR}"
                    dir "C:\\JenkinsCache"
                """
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'Rakesh', url: 'https://github.com/rakesh-mindfire/PlaywrightTesting.git'
            }
        }

        stage('Clear Cache if Dependencies Changed') {
            steps {
                script {
                    // Check if package-lock.json exists
                    if (!fileExists('package-lock.json')) {
                        error "package-lock.json not found. Please generate and commit it to the repository."
                    }
                    // Debug: List package-lock.json
                    bat 'dir package-lock.json'
                    // Compute SHA1 hash of package-lock.json
                    def lockFileHash = bat(script: 'certutil -hashfile package-lock.json SHA1 | findstr /R "[0-9a-fA-F]\\{40\\}"', returnStdout: true).trim()
                    echo "Computed package-lock.json hash: ${lockFileHash}"
                    def cachedHashFile = "${NPM_CACHE_DIR}\\lockfile_hash.txt"
                    def cachedHash = fileExists(cachedHashFile) ? readFile(cachedHashFile).trim() : ''
                    echo "Cached hash: ${cachedHash}"
                    if (cachedHash != lockFileHash) {
                        bat """
                            if exist "${NPM_CACHE_DIR}\\node_modules" rmdir /S /Q "${NPM_CACHE_DIR}\\node_modules"
                            echo ${lockFileHash}> "${cachedHashFile}"
                            dir "${NPM_CACHE_DIR}"
                        """
                    }
                }
            }
        }

        stage('Restore Cache') {
            steps {
                // Restore node_modules and Playwright binaries if they exist
                bat """
                    if exist "${NPM_CACHE_DIR}\\node_modules" (
                        xcopy /E /I /Y "${NPM_CACHE_DIR}\\node_modules" node_modules
                    )
                    if exist "${PLAYWRIGHT_CACHE_DIR}" (
                        xcopy /E /I /Y "${PLAYWRIGHT_CACHE_DIR}" "${env.USERPROFILE}\\.cache\\ms-playwright"
                    )
                    dir node_modules
                    dir "${env.USERPROFILE}\\.cache\\ms-playwright"
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Save Cache') {
            steps {
                // Save node_modules and Playwright binaries to cache
                bat """
                    if not exist "${NPM_CACHE_DIR}" mkdir "${NPM_CACHE_DIR}"
                    xcopy /E /I /Y node_modules "${NPM_CACHE_DIR}\\node_modules"
                    if not exist "${env.USERPROFILE}\\.cache\\ms-playwright" mkdir "${env.USERPROFILE}\\.cache\\ms-playwright"
                    xcopy /E /I /Y "${env.USERPROFILE}\\.cache\\ms-playwright" "${PLAYWRIGHT_CACHE_DIR}"
                    dir "${NPM_CACHE_DIR}\\node_modules"
                    dir "${env.USERPROFILE}\\.cache\\ms-playwright"
                """
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
            cleanWs(notFailBuild: true, patterns: [[pattern: 'C:\\JenkinsCache\\**', type: 'EXCLUDE'], [pattern: "${env.USERPROFILE}\\.cache\\ms-playwright\\**", type: 'EXCLUDE']])
        }
    }
}
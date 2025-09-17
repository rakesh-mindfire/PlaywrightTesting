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
            steps {
                script {
                    if (!fileExists('package-lock.json')) {
                        error "package-lock.json not found. Please generate and commit it to the repository."
                    }
                    bat 'dir package-lock.json'
                    def lockFileHash = ''
                    try {
                        lockFileHash = bat(script: 'powershell -Command "(Get-FileHash -Path package-lock.json -Algorithm SHA1).Hash.ToLower()"', returnStdout: true).trim()
                        echo "Computed package-lock.json hash (PowerShell): ${lockFileHash}"
                    } catch (Exception e) {
                        echo "Error computing hash with PowerShell: ${e.message}"
                        error "Failed to compute SHA1 hash of package-lock.json."
                    }
                    if (lockFileHash == '') {
                        error "Computed hash is empty. Cannot proceed with cache validation."
                    }
                    def cachedHashFile = "${NPM_CACHE_DIR}\\lockfile_hash.txt"
                    def cachedHash = fileExists(cachedHashFile) ? readFile(cachedHashFile).trim() : ''
                    echo "Cached hash: ${cachedHash}"
                    if (cachedHash != lockFileHash) {
                        echo "Dependencies changed. Clearing cache and saving new hash."
                        bat "if exist \"${NPM_CACHE_DIR}\\node_modules\" rmdir /S /Q \"${NPM_CACHE_DIR}\\node_modules\""
                        writeFile(file: cachedHashFile, text: lockFileHash)
                        bat "dir \"${NPM_CACHE_DIR}\""
                    } else {
                        echo "Dependencies have not changed. Reusing existing cache."
                    }
                }
            }
        }

        stage('Restore Cache') {
    steps {
        script {
            def nodeModulesCacheDir = "${NPM_CACHE_DIR}\\node_modules"
            def playwrightCacheDir = "${PLAYWRIGHT_CACHE_DIR}"
            
            if (fileExists(nodeModulesCacheDir)) {
                echo "Restoring cached node_modules..."
                bat "xcopy /E /I /Y \"${nodeModulesCacheDir}\" node_modules"
            } else {
                echo "No node_modules cache directory found."
            }

            if (fileExists(playwrightCacheDir)) {
                echo "Restoring cached Playwright browsers..."
                bat "xcopy /E /I /Y \"${playwrightCacheDir}\" \"${env.USERPROFILE}\\.cache\\ms-playwright\""
            } else {
                echo "No Playwright cache directory found."
            }
        }
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
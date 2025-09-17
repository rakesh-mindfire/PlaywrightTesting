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
        stage('Clean Workspace') {
            steps {
                script {
                    // Retry workspace deletion to handle locked files
                    retry(3) {
                        bat """
                            if exist "C:\\ProgramData\\Jenkins\\.jenkins\\workspace\\PlaywrightPipeline" (
                                taskkill /F /FI "IMAGENAME eq git.exe" /T || echo No git.exe processes to terminate
                                taskkill /F /FI "IMAGENAME eq node.exe" /T || echo No node.exe processes to terminate
                                rmdir /S /Q "C:\\ProgramData\\Jenkins\\.jenkins\\workspace\\PlaywrightPipeline" || echo Failed to delete workspace, retrying...
                                dir "C:\\ProgramData\\Jenkins\\.jenkins\\workspace" || echo Workspace directory does not exist
                            )
                        """
                        cleanWs(notFailBuild: true)
                    }
                }
            }
        }

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
                def lockFileHash = ''
                try {
                    // Use PowerShell for robustness.
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
                    
                    // Clear the node_modules cache directory
                    bat "if exist \"${NPM_CACHE_DIR}\\node_modules\" rmdir /S /Q \"${NPM_CACHE_DIR}\\node_modules\""
                    
                    // Write the new hash using Groovy's writeFile
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
                // Restore node_modules and Playwright binaries if they exist
                bat """
                    if exist "${NPM_CACHE_DIR}\\node_modules" (
                        xcopy /E /I /Y "${NPM_CACHE_DIR}\\node_modules" node_modules
                    )
                    if exist "${PLAYWRIGHT_CACHE_DIR}" (
                        xcopy /E /I /Y "${PLAYWRIGHT_CACHE_DIR}" "${env.USERPROFILE}\\.cache\\ms-playwright"
                    )
                    dir node_modules || echo No node_modules directory found
                    dir "${env.USERPROFILE}\\.cache\\ms-playwright" || echo No Playwright cache directory found
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
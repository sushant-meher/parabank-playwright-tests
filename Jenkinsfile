// Jenkinsfile
pipeline {
    agent any // Or 'agent { docker { image 'mcr.microsoft.com/playwright/node:lts-slim' } }' for Docker

    tools {
        // This 'nodejs' name must match the 'NodeJS installations' name configured in Jenkins -> Manage Jenkins -> Tools
        nodejs 'Node_20.x.x' // Use the exact name you gave your NodeJS installation in Jenkins config
    }

    environment {
        // Load environment variables for the tests.
        // For ParaBank, these might be static. For sensitive data, use Jenkins credentials.
        BASE_URL = 'https://parabank.parasoft.com/'
        API_BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank'
        // Example for Jenkins Credentials Plugin for sensitive data:
        // VALID_USERNAME = credentials('para_bank_user_username')
        // VALID_PASSWORD = credentials('para_bank_user_password')
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout your SCM (Git) repository
                git branch: 'main', url: 'https://github.com/your-username/your-playwright-project.git' // REPLACE with your actual repo URL
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install' // Installs all dependencies from package.json
                sh 'npx playwright install --with-deps' // Installs Playwright browsers and their dependencies
            }
        }

        stage('Run Playwright UI Tests') {
            steps {
                script {
                    try {
                        sh "npm run test:ui"
                    } catch (error) {
                        currentBuild.result = 'UNSTABLE'
                        throw error
                    }
                }
            }
        }

        stage('Run Playwright API Tests') {
            steps {
                script {
                    try {
                        sh "npm run test:api"
                    } catch (error) {
                        currentBuild.result = 'UNSTABLE'
                        throw error
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive test results and artifacts
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
            archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true

            // Publish the HTML report (requires HTML Publisher plugin)
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])

            // Clean up node_modules to save space
            sh 'rm -rf node_modules'
        }
        success {
            echo 'Playwright tests succeeded!'
        }
        failure {
            echo 'Playwright tests failed!'
        }
        unstable {
            echo 'Playwright tests passed with some failures or warnings!'
        }
        // cleanWs() // Uncomment if you want Jenkins to clean the workspace after each build
    }
}
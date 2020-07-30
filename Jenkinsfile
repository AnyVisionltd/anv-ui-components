pipeline {
    agent { 
        label 'cicd'
    }
    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
        timeout(time: 3, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr:'50'))        
    }    
    libraries {
        lib('pipeline-library')
    }
    environment {
        SHORT_COMMIT = "${GIT_COMMIT[0..6]}"
        DOCKER_BUILDKIT='1'
        DOCKER_EXTRA_ARGS = "--build-arg RUN_TYPE=ci"
    }
    stages {
        stage('Initialize') {
            when { 
                not { changelog '.*Committed by Jenkins.*' }
            }
            steps {
                script {
                    genericAnvComponents()
                }
            }
        }
    }
}
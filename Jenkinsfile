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
        SKIP_HELM = 'true'
    }
    stages {
        stage('Initialize') {     
            steps {
                script {
                    genericPipelineNodejs()
                }
            }
        }
    }
}
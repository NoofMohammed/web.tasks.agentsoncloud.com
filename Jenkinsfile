pipeline {
    agent any
      options {
        ansiColor('xterm')
    }
    stages {
         stage('Build') {
            steps {
            echo("I am in build")
            sshPublisher(
            continueOnError: false, failOnError: true,
            publishers: [
                sshPublisherDesc(
                configName: "dev server",
                verbose: true,
                transfers: [
                    sshTransfer(
                        execCommand: "sudo rm -rf /var/www/web.tasks.agentsoncloud.com"
                          ),
                    sshTransfer(
                        execCommand: "cd /var/www/ && git clone --branch release_1 https://github.com/agents-on-cloud/web.tasks.agentsoncloud.com.git"
                          ),
               sshTransfer(
                        execCommand: "cd /var/www/web.tasks.agentsoncloud.com && npm i  "
                         ),
                ])
            ])
            }
        }
        stage('Test') {
            steps {
                echo ("I am in Test")
            }
        }
        stage('Deploy') {
            steps {
                echo("I am in Deploy")
                 sshPublisher(
            continueOnError: false, failOnError: true,
            publishers: [
                sshPublisherDesc(
                configName: "dev server",
                verbose: true,
                transfers: [
               sshTransfer(
                        execCommand: "cd /var/www/web.tasks.agentsoncloud.com && npm run build &&  pm2 start "
                         ),
                ])
            ])
            }
        }
    }
     post {
        always {
           slackSend channel: "#development-jenkins", message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} : Started . ",color:"good"
        }
        success {
          slackSend channel: "#development-jenkins", message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} : Build Finshed Success . ",color:"good"
        }
        unstable {
           slackSend channel: "#development-jenkins", message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} : Build have Error  . ", color:"warning"
        }
        failure {
            slackSend channel: "#development-jenkins", message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} : Failure Build  . ",color:"danger"
        }
        changed {
             echo 'Things were different before...'
        }
    }
}
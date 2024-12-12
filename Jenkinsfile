pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/www/dailycollege-express-app'  // Ganti dengan direktori yang sesuai di server Anda
        GIT_REPO = 'https://github.com/rizalkalam/dailycode-rest-server.git'  // Ganti dengan URL GitHub repo Anda
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    git url: "${GIT_REPO}", branch: 'main'  // Ganti dengan nama branch yang digunakan
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependensi menggunakan pnpm
                    sh 'pnpm install'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop aplikasi lama jika ada
                    sh 'pm2 stop express-app || true'

                    // Salin semua file ke direktori deploy
                    sh 'cp -r * $DEPLOY_DIR/'

                    // Install dependensi di server jika ada yang belum terinstal
                    sh 'cd $DEPLOY_DIR && pnpm install'

                    // Mulai aplikasi dengan PM2
                    sh 'cd $DEPLOY_DIR && pm2 start server.js --name "express-app"'
                    
                    // (Opsional) Setel PM2 agar aplikasi berjalan otomatis saat server restart
                    sh 'pm2 startup'
                    sh 'pm2 save'
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Hapus file build sementara atau file lain yang tidak diperlukan
                    sh 'rm -rf $DEPLOY_DIR/tmp/*'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

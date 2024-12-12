pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/www/dailycollege-express-app'
        GIT_REPO = 'https://github.com/rizalkalam/dailycode-rest-server.git'  // Ganti dengan URL GitHub repo Anda
        PATH = "/usr/local/bin:$PATH"  // Tambahkan path global npm di Jenkins
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

        stage('Prepare Directory') {
            steps {
                script {
                    // Pastikan direktori deploy ada dan memiliki izin yang benar
                    sh 'sudo mkdir -p $DEPLOY_DIR'
                    sh 'sudo chown -R jenkins:jenkins $DEPLOY_DIR'
                    sh 'sudo chmod -R 755 $DEPLOY_DIR'
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

                    // Verifikasi bahwa file server.js ada di direktori deploy
                    sh 'ls -l $DEPLOY_DIR/src'

                    // Install dependensi di server jika ada yang belum terinstal
                    sh 'cd $DEPLOY_DIR && pnpm install'

                    // Mulai aplikasi dengan PM2, gunakan path yang benar untuk server.js
                    sh 'cd $DEPLOY_DIR && pm2 start src/server.js --name "express-app"'
                    
                    // (Opsional) Setel PM2 agar aplikasi berjalan otomatis saat server restart
                    sh 'pm2 startup'
                    sh 'pm2 save'
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Menggunakan deleteDir() untuk membersihkan direktori kerja
                    deleteDir()
                }
            }
        }
    }

    post {
        always {
            deleteDir()  // Membersihkan direktori kerja setelah pipeline selesai
        }
    }
}

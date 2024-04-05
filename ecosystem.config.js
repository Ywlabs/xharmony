module.exports = {
    apps: [{
        name: 'xharmony-api', // 생성할 프로세스의 이름
        script: './dist/main.js', // 프로세스 생성 시 pm2 start를 할 경로(보통 서버 파일)
        instances: 1, // 생성할 인스턴스의 개수, 0, -1 => 최대 코어 수
        exec_mode: 'cluster',// 클러스터 모드 (cluster) 포크모드 (fork)
        env_dev: {
            // 개발 환경설정
            NODE_ENV: 'dev',
        },
        env_prod: {
            // 운영 환경설정 (--env production 옵션으로 지정할 수 있다.)
            NODE_ENV: 'prod',
        }    
    }]
}
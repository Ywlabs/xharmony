/**
 * Create by Masasiki 
 * X하모니 프레임웍 : 주요 공통 Config 설정 
 * 2024.01.25
 */
export default () => ({
  app: {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 33900,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  jwt : {
    access_key : process.env.JWT_ACCESS_KEY,
    access_ms : process.env.JWT_ACCESS_MS,
    refresh_key : process.env.JWT_REFRESH_KEY,
    refresh_ms : process.env.JWT_REFRESH_MS
  },
  upload : {
    file_folder : process.env.UPLOAD_FILE_FOLDER,
    url_path : process.env.UPLOAD_URL_PATH,
  },
  comm : {
    reqtimeout : parseInt(process.env.COMM_REQ_TIMEOUT, 10) || 30000,
  }
});
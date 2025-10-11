# SurveyApp – Hệ thống Khảo sát Trực tuyến

> **FE**: React + Vite (deploy S3 + CloudFront)  
> **BE**: Node.js/Express + MongoDB (ECS Fargate sau ALB)  
> **CI/CD**: GitHub Actions  
> **Quan sát**: CloudWatch Logs/Alarms/Dashboard + X-Ray

---

## 1) Kiến trúc hệ thống

### 1.1 Kiến trúc AWS (High level)

```mermaid
flowchart LR
  subgraph Client["Người dùng"]
    U[Browser]
  end

  subgraph FE["Frontend"]
    CF[CloudFront\n(dùng SSL/Cache)]
    S3[S3 Bucket\nsurvey-fe-build-cua-nhom-3-ku-dep-trzoai]
  end

  subgraph BE["Backend (ECS Fargate)"]
    ALB[ALB\nHTTP/HTTPS]
    ECS[ECS Service/Task\nNode.js Express]
    CWL[(CloudWatch Logs)]
    XR[(AWS X-Ray)]
  end

  DB[(MongoDB\n(Atlas/Other))]

  U <---> CF
  CF --> S3

  U --> ALB
  ALB --> ECS
  ECS --> DB

  ECS --> CWL
  ECS --> XR


### 1.2 CI/CD pipeline
flowchart LR
  Dev[Developer] -->|git push main| GH[GitHub]
  GH -->|Actions| GA_FE[workflow: fe-deploy.yml]
  GA_FE -->|build| FE_Build[Vite build]
  FE_Build -->|aws s3 sync| S3
  GA_FE -->|invalidate| CF

  GH -->|Actions| GA_BE[workflow: be-deploy.yml]
  GA_BE -->|docker build/push| ECR[(Amazon ECR)]
  GA_BE -->|update service| ECS
  ECS --> ALB

## 2) Cấu trúc repo

### Cấu trúc thư mục

Lab3_QLDAPM_SurveyApp/
│
├── .github
│   └── workflows
│       ├── be-deploy.yml
│       └── fe-deploy.yml
├── survey-be
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   └── routes
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── survey-fe
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── assets
│   │   ├── pages
│   │   ├── state
│   │   └── utils
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
## 3) File pipeline

### 3.1 FE – .github/workflows/fe-deploy.yml

### 3.2 BE – .github/workflows/be-deploy.yml

Docker build & push lên ECR, ecs update-service --force-new-deployment.
---

## 4) Logging & Monitoring

### 4.1 Dashboard

Tên: survey-overview

Widget: HealthyHostCount, UnHealthyHostCount, RequestCountPerTarget, TargetResponseTime,
HTTPCode_ELB_4XX/5XX/503, HTTPCode_Target_2XX/4XX/5XX, CPUUtilization, MemoryUtilization.


### 4.2 Alarms (ví dụ)

UnHealthyHostCount > 0 → SNS alerts-survey

HTTPCode_ELB_5XX_Count > 1 in 5m

HTTPCode_Target_5XX_Count > 5 in 5m (metric xuất hiện khi app thực sự trả 5xx)

## 4.3 X-Ray & Logs

Logs group: /ecs/survey-be

X-Ray (Express):

const AWSXRay = require('aws-xray-sdk');
AWSXRay.middleware.setSamplingRules('{"version":2,"rules":[{"description":"default","service_name":"survey-be","http_method":"*","url_path":"*","fixed_target":1,"rate":0.1}],"default":{"fixed_target":1,"rate":0.05}}');
app.use(AWSXRay.express.openSegment('survey-be'));
...
app.use(AWSXRay.express.closeSegment());


Task Role gắn AWSXRayDaemonWriteAccess.


## 5) Hướng dẫn demo (AWS – ap-southeast-1)

FE

S3: http://survey-fe-build-cua-nhom-3-ku-dep-trzoai.s3-website-ap-southeast-1.amazonaws.com

BE

ALB DNS: http://alb-survey-740854700.ap-southeast-1.elb.amazonaws.com

Health: GET /healthz → 200 ok

API auth: /auth/register, /auth/login, …

CI/CD

Push main → Actions fe-deploy (và be-deploy nếu có) chạy.

Kiểm tra S3 objects & CloudFront Invalidation / ECS Deployment.

Quan sát

Dashboard survey-overview & Alarms, X-Ray Service map/Traces.



## 6) Chạy cục bộ
Backend
cd survey-be
npm i
npm run dev
# .env: MONGODB_URI, JWT_SECRET, PORT=80, ALLOW_ORIGIN=https://<cloudfront-domain>

Frontend
cd survey-fe
npm i
npm run dev
# .env.development: VITE_API_URL=http://alb-survey-740854700.ap-southeast-1.elb.amazonaws.com

## Ghi chú

- Đảm bảo backend và frontend cùng bật khi sử dụng.
- Có thể tùy chỉnh biến môi trường cho phù hợp môi trường triển khai thực tế.
- Để build production:  
	- Backend: deploy như app Node.js thông thường  
	- Frontend: `npm run build` (thư mục `dist/`)

---

## Đóng góp

Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất vui lòng tạo issue hoặc pull request.
gi
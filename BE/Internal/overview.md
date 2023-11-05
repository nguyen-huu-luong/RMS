# Tổng quan
## Phần back end được hiện thực theo kiến trúc 3-layer, với flow giống như trong class digram. Cụ thể:
    - app.ts => router => loader => controller => service => repository => model
### Trong đó:
    - controller: được coi như là cổng chỉ để nhận request. Mọi logic, kiêm tra data request đều được xử lý ở service
    - service: xử lý business logic
    - repository: xử lý bên phía database, gồm 1 hay nhiều entity trong model
    - model: định nghĩa các entity trong sequenlize

# Set up
    - Trong file .env, mn thay đổi các giá trị: HOST, USER, PASSWORD tương ứng với số liệu postgre trên máy
    - Không cần phải tạo database trong DBMS
    - npm start

# Demo
## Giả sử mn muốn cập nhật đơn hàng, để thêm thông về khách hàng
### Tạo khách hàng
- http://localhost:3003/customer (POST)
- body
    {
    "firstname": "Tony",
    "lastname": "Nguyen",
    "gender": "Male"
}

### Xem khách hàng
- http://localhost:3003/customer/all (GET)

### Tạo đơn hàng
- http://localhost:3003/order (POST)
- body {
    "status": "processing",
    "descriptions": "New order",
    "pre_discount_ammount": 100000,
    "num_items" : 3
}

### Xem đơn hàng
- http://localhost:3003/order/all (GET)
=> mn sẽ thấy trường "CustomerId" đang null

### Gán đơn hàng cho 1 khách hàng
- http://localhost:3003/order (PUT)
- body {
    "order": 1,
    "user": 1
}

### Xem đơn hàng
- http://localhost:3003/order/all (GET)
=> trường "CustomerId" đã có giá trị
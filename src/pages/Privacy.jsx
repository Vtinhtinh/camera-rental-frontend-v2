import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-3">Chính sách bảo mật</h1>
          <p className="text-gray-400 text-lg">Cập nhật lần cuối: 15/05/2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Mục lục</h2>
            <ul className="space-y-2">
              {[
                { num: '1', title: 'Giới thiệu' },
                { num: '2', title: 'Thông tin chúng tôi thu thập' },
                { num: '3', title: 'Cách chúng tôi sử dụng thông tin' },
                { num: '4', title: 'Lưu trữ và bảo mật dữ liệu' },
                { num: '5', title: 'Chia sẻ thông tin' },
                { num: '6', title: 'Quyền của bạn' },
                { num: '7', title: 'Cookies' },
                { num: '8', title: 'Liên kết bên thứ ba' },
                { num: '9', title: 'Thay đổi chính sách' },
                { num: '10', title: 'Liên hệ' },
              ].map((item) => (
                <li key={item.num}>
                  <a
                    href={`#section-${item.num}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500 font-medium">{item.num}.</span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 prose prose-invert max-w-none">
            {/* Section 1 */}
            <section id="section-1" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Giới thiệu</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                CameraRent ("chúng tôi", "của chúng tôi") cam kết bảo vệ và tôn trọng 
                quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi 
                thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn 
                sử dụng dịch vụ của chúng tôi.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Bằng việc sử dụng dịch vụ của CameraRent, bạn đồng ý với việc thu thập 
                và sử dụng thông tin theo chính sách này.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Thông tin chúng tôi thu thập</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">2.1. Thông tin bạn cung cấp</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Địa chỉ nhà/công ty</li>
                <li>Ngày sinh</li>
                <li>Thông tin thanh toán</li>
                <li>Hình ảnh CCCD/CMND (khi cần xác minh)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.2. Thông tin tự động thu thập</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt và phiên bản</li>
                <li>Hệ điều hành</li>
                <li>Trang web bạn đã truy cập trước</li>
                <li>Thời gian và ngày truy cập</li>
                <li>Cookie và dữ liệu phiên</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.3. Thông tin từ bên thứ ba</h3>
              <p className="text-gray-400 leading-relaxed">
                Chúng tôi có thể nhận thông tin từ các bên thứ ba như Google (khi bạn 
                đăng nhập bằng Google) bao gồm: tên, email, và ảnh đại diện.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chúng tôi sử dụng thông tin thu thập được để:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Tạo và quản lý tài khoản người dùng</li>
                <li>Xử lý đơn hàng thuê máy</li>
                <li>Liên hệ xác nhận đơn hàng và giao hàng</li>
                <li>Gửi thông báo về đơn hàng và dịch vụ</li>
                <li>Hỗ trợ khách hàng và giải quyết khiếu nại</li>
                <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                <li>Gửi thông tin khuyến mãi (nếu bạn đồng ý)</li>
                <li>Ngăn chặn gian lận và lạm dụng</li>
                <li>Tuân thủ nghĩa vụ pháp lý</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Lưu trữ và bảo mật dữ liệu</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">4.1. Lưu trữ dữ liệu</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Thông tin của bạn được lưu trữ trên các máy chủ bảo mật tại Việt Nam. 
                Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp 
                để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, thay đổi, tiết lộ 
                hoặc phá hủy.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">4.2. Thời gian lưu trữ</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết 
                để thực hiện các mục đích nêu trong chính sách này, trừ khi pháp luật 
                yêu cầu lưu trữ lâu hơn.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">4.3. Biện pháp bảo mật</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Mã hóa dữ liệu khi truyền tải (SSL/TLS)</li>
                <li>Tường lửa và hệ thống phát hiện xâm nhập</li>
                <li>Kiểm soát truy cập nghiêm ngặt</li>
                <li>Backup dữ liệu định kỳ</li>
                <li>Đào tạo nhân viên về bảo mật thông tin</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Chia sẻ thông tin</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chúng tôi cam kết không bán thông tin cá nhân của bạn cho bên thứ ba. 
                Thông tin có thể được chia sẻ trong các trường hợp sau:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li><strong>Đối tác cung cấp dịch vụ:</strong> Các công ty hỗ trợ vận hành như xử lý thanh toán, giao hàng (có cam kết bảo mật)</li>
                <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền</li>
                <li><strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền, tài sản hoặc sự an toàn của CameraRent</li>
                <li><strong>Liên kết doanh nghiệp:</strong> Trong trường hợp sáp nhập, mua lại (với thông báo trước)</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Quyền của bạn</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Bạn có các quyền sau đối với thông tin cá nhân của mình:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li><strong>Truy cập:</strong> Yêu cầu xem thông tin cá nhân của bạn</li>
                <li><strong>Chỉnh sửa:</strong> Yêu cầu sửa đổi thông tin không chính xác</li>
                <li><strong>Xóa:</strong> Yêu cầu xóa thông tin cá nhân</li>
                <li><strong>Hạn chế:</strong> Yêu cầu hạn chế xử lý thông tin</li>
                <li><strong>Phản đối:</strong> Phản đối việc xử lý thông tin cho mục đích marketing</li>
                <li><strong>Di chuyển:</strong> Yêu cầu chuyển giao dữ liệu cho bạn hoặc bên thứ ba</li>
              </ul>
              <p className="text-gray-400 leading-relaxed">
                Để thực hiện các quyền trên, vui lòng liên hệ với chúng tôi qua email:{' '}
                <a href="mailto:tinh84vo@gmail.com" className="text-blue-400 hover:underline">
                  tinh84vo@gmail.com
                </a>.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Cookie là các tệp nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. 
                Chúng tôi sử dụng cookie để:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Ghi nhớ tài khoản và đăng nhập</li>
                <li>Lưu trữ giỏ hàng và tùy chọn</li>
                <li>Phân tích lưu lượng truy cập</li>
                <li>Cá nhân hóa trải nghiệm người dùng</li>
              </ul>
              <p className="text-gray-400 leading-relaxed">
                Bạn có thể từ chối cookie bằng cách cài đặt trình duyệt. Tuy nhiên, 
                một số tính năng của website có thể không hoạt động đầy đủ nếu tắt cookie.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Liên kết bên thứ ba</h2>
              <p className="text-gray-400 leading-relaxed">
                Website của chúng tôi có thể chứa liên kết đến các website bên thứ ba. 
                Chúng tôi không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc 
                thực tiễn của các website này. Bạn nên xem xét chính sách bảo mật của 
                bất kỳ website bên thứ ba nào bạn truy cập.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Thay đổi chính sách</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. 
                Mọi thay đổi sẽ được đăng tải trên trang này với ngày cập nhật mới.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để nắm 
                được cách chúng tôi bảo vệ thông tin của bạn.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">10. Liên hệ</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến Chính sách bảo mật này, 
                vui lòng liên hệ:
              </p>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <p className="text-white font-medium mb-2">CameraRent</p>
                <p className="text-gray-400 mb-1">📍 637/1/2 Đường Hà Huy Giáp, Quận 12, TP. Hồ Chí Minh</p>
                <p className="text-gray-400 mb-1">📞 0943 029 660</p>
                <p className="text-gray-400 mb-1">✉️ tinh84vo@gmail.com</p>
              </div>
            </section>

            {/* Back to Terms */}
            <div className="mt-8 pt-6 border-t border-gray-700 text-center">
              <Link
                to="/terms"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                ← Xem Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

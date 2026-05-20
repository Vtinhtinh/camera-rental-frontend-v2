import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-3">Điều khoản sử dụng</h1>
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
                { num: '2', title: 'Điều kiện sử dụng' },
                { num: '3', title: 'Quy định thuê máy' },
                { num: '4', title: 'Thanh toán' },
                { num: '5', title: 'Trách nhiệm & Bảo hành' },
                { num: '6', title: 'Hủy đơn hàng' },
                { num: '7', title: 'Quyền sở hữu trí tuệ' },
                { num: '8', title: 'Bảo mật thông tin' },
                { num: '9', title: 'Giới hạn trách nhiệm' },
                { num: '10', title: 'Sửa đổi điều khoản' },
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
                Chào mừng bạn đến với CameraRent - dịch vụ cho thuê máy ảnh chuyên nghiệp. 
                Khi sử dụng website và dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản 
                sử dụng được nêu dưới đây.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ. Nếu bạn không đồng ý 
                với bất kỳ điều khoản nào, xin vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Điều kiện sử dụng</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Để sử dụng dịch vụ của CameraRent, bạn cần:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Đủ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ hợp pháp</li>
                <li>Cung cấp thông tin chính xác và đầy đủ khi đăng ký</li>
                <li>Chịu trách nhiệm bảo mật thông tin tài khoản của mình</li>
                <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Tuân thủ các quy định pháp luật hiện hành</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">3. Quy định thuê máy</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">3.1. Đặt hàng</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Khi đặt thuê máy, bạn cần cung cấp thông tin cá nhân chính xác và thanh toán 
                khoản đặt cọc theo quy định. Đơn hàng chỉ được xác nhận khi đã nhận được thanh toán.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">3.2. Nhận máy</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Khi nhận máy, bạn cần kiểm tra tình trạng thiết bị và ký xác nhận biên bản bàn giao. 
                Mọi hư hỏng, trầy xước phát hiện lúc nhận máy sẽ được ghi nhận để tránh tranh chấp.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">3.3. Trả máy</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Máy phải được trả đúng thời hạn và địa điểm đã thỏa thuận. Thiết bị cần được 
                trả trong tình trạng tương tự lúc nhận, trừ hao mòn tự nhiên.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">3.4. Thời gian thuê</h3>
              <p className="text-gray-400 leading-relaxed">
                Thời gian thuê tối thiểu là 1 ngày. Thời gian thuê được tính từ lúc nhận máy 
                đến lúc trả máy. Trả muộn sẽ bị tính phí theo quy định.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Thanh toán</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chúng tôi hỗ trợ các phương thức thanh toán sau:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Tiền mặt tại cửa hàng</li>
                <li>Chuyển khoản ngân hàng</li>
                <li>Thanh toán qua VNPay, VietQR</li>
                <li>Thẻ ATM, Visa, Mastercard</li>
              </ul>
              <p className="text-gray-400 leading-relaxed">
                Bạn cần thanh toán ít nhất 30% giá trị đơn hàng để xác nhận đặt chỗ. 
                Số tiền còn lại thanh toán khi nhận máy.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Trách nhiệm & Bảo hành</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">5.1. Trách nhiệm của khách hàng</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Bạn chịu trách nhiệm bảo quản thiết bị trong suốt thời gian thuê. 
                Mọi hư hỏng, mất mát do sử dụng không đúng cách hoặc do lỗi của bạn 
                sẽ được xử lý theo quy định.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">5.2. Bảo hành</h3>
              <p className="text-gray-400 leading-relaxed">
                Thiết bị được bảo hành trong trường hợp lỗi kỹ thuật từ nhà sản xuất. 
                Các lỗi phát sinh do va đập, vào nước, sử dụng sai cách không thuộc phạm vi bảo hành.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Hủy đơn hàng</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Chính sách hủy đơn hàng:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Hủy trước 48 giờ: Hoàn 100% tiền đặt cọc</li>
                <li>Hủy trong 24-48 giờ: Hoàn 50% tiền đặt cọc</li>
                <li>Hủy trong 24 giờ: Không hoàn tiền đặt cọc</li>
              </ul>
              <p className="text-gray-400 leading-relaxed">
                Trường hợp hủy do sự cố từ phía CameraRent, chúng tôi sẽ hoàn tiền 100% 
                và hỗ trợ tìm thiết bị thay thế nếu có thể.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Quyền sở hữu trí tuệ</h2>
              <p className="text-gray-400 leading-relaxed">
                Toàn bộ nội dung trên website, bao gồm nhưng không giới hạn: logo, hình ảnh, 
                văn bản, thiết kế, mã nguồn đều thuộc quyền sở hữu của CameraRent hoặc 
                được cấp phép hợp lệ. Bạn không được sao chép, phân phối hoặc sử dụng 
                cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Bảo mật thông tin</h2>
              <p className="text-gray-400 leading-relaxed">
                Chúng tôi cam kết bảo mật thông tin cá nhân của bạn theo 
                <Link to="/privacy" className="text-blue-400 hover:underline ml-1">
                  Chính sách bảo mật
                </Link>. 
                Thông tin của bạn chỉ được sử dụng để cung cấp dịch vụ và sẽ không 
                được chia sẻ với bên thứ ba khi chưa có sự đồng ý, trừ trường hợp 
                pháp luật yêu cầu.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Giới hạn trách nhiệm</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                CameraRent không chịu trách nhiệm về:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Thiệt hại gián tiếp hoặc do sử dụng dịch vụ</li>
                <li>Gián đoạn dịch vụ do lỗi hệ thống hoặc bảo trì</li>
                <li>Mất mát dữ liệu do nguyên nhân khách quan</li>
                <li>Thiệt hại phát sinh từ hành vi vi phạm của người dùng</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">10. Sửa đổi điều khoản</h2>
              <p className="text-gray-400 leading-relaxed">
                Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. 
                Thông báo thay đổi sẽ được đăng tải trên website. Việc tiếp tục sử dụng 
                dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều 
                khoản mới.
              </p>
            </section>
          </div>

          {/* Contact */}
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
            <p className="text-gray-400">
              Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ:{' '}
              <a href="tel:0943029660" className="text-blue-400 hover:underline">
                0943 029 660
              </a>{' '}
              hoặc{' '}
              <a href="mailto:tinh84vo@gmail.com" className="text-blue-400 hover:underline">
                tinh84vo@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

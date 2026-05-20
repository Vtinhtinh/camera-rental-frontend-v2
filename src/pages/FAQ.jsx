import { useState } from 'react';

const faqData = [
  {
    category: 'Thuê máy ảnh',
    questions: [
      {
        q: 'Làm sao để thuê máy ảnh?',
        a: 'Bạn có thể thuê máy ảnh bằng cách: (1) Chọn sản phẩm trên website, (2) Đặt lịch thuê, (3) Thanh toán đơn hàng, (4) Nhận máy tại cửa hàng hoặc yêu cầu giao hàng.'
      },
      {
        q: 'Tôi cần cọc bao nhiêu khi thuê máy?',
        a: 'Số tiền cọc tùy thuộc vào giá trị máy ảnh. Thông thường, bạn cần đặt cọc 30-50% giá trị thiết bị. Tiền cọc sẽ được hoàn trả đầy đủ khi bạn trả máy đúng hạn và không có hư hại.'
      },
      {
        q: 'Thời gian thuê tối thiểu là bao lâu?',
        a: 'Thời gian thuê tối thiểu là 1 ngày. Bạn có thể thuê theo ngày, tuần hoặc tháng với các gói ưu đãi đặc biệt cho thuê dài hạn.'
      },
      {
        q: 'Tôi có thể gia hạn hợp đồng thuê không?',
        a: 'Có, bạn có thể gia hạn bằng cách liên hệ với chúng tôi qua hotline hoặc tin nhắn. Chúng tôi sẽ kiểm tra tình trạng máy và xác nhận đặt cọc cho thời gian gia hạn.'
      }
    ]
  },
  {
    category: 'Thanh toán',
    questions: [
      {
        q: 'Tôi có thể thanh toán bằng những phương thức nào?',
        a: 'Chúng tôi hỗ trợ: Tiền mặt, Chuyển khoản ngân hàng, VNPay, VietQR, và các thẻ ATM/ Visa/ Mastercard.'
      },
      {
        q: 'Tôi có phải thanh toán ngay khi đặt không?',
        a: 'Bạn cần thanh toán ít nhất 30% giá trị đơn hàng để xác nhận đặt chỗ. Số tiền còn lại thanh toán khi nhận máy.'
      },
      {
        q: 'Chính sách hoàn tiền như thế nào?',
        a: 'Nếu bạn hủy đơn trước 48 giờ so với ngày nhận máy, chúng tôi sẽ hoàn 100% tiền đặt cọc. Hủy trong vòng 48 giờ sẽ mất 50% tiền đặt cọc.'
      }
    ]
  },
  {
    category: 'Bảo hành & Hư hỏng',
    questions: [
      {
        q: 'Máy thuê có được bảo hành không?',
        a: 'Tất cả máy đều được bảo hành đầy đủ. Nếu máy gặp lỗi kỹ thuật trong quá trình thuê (không phải do bạn gây ra), chúng tôi sẽ đổi máy mới hoặc hoàn tiền.'
      },
      {
        q: 'Nếu máy bị hư hỏng do tôi thì sao?',
        a: 'Bạn sẽ chịu trách nhiệm chi phí sửa chữa hoặc thay thế theo mức độ hư hỏng. Chúng tôi khuyến khích bạn kiểm tra kỹ máy khi nhận và báo lại ngay nếu phát hiện vấn đề.'
      },
      {
        q: 'Tôi có nên mua bảo hiểm khi thuê không?',
        a: 'Chúng tôi khuyến khích bạn mua bảo hiểm để bảo vệ bản thân trước các rủi ro bất ngờ. Chi phí bảo hiểm chỉ từ 2-5% giá trị thiết bị.'
      }
    ]
  },
  {
    category: 'Giao nhận máy',
    questions: [
      {
        q: 'Tôi có thể nhận máy tại cửa hàng không?',
        a: 'Có, bạn có thể nhận máy trực tiếp tại cửa hàng: 637/1/2 Đường Hà Huy Giáp, Quận 12, TP. Hồ Chí Minh. Thời gian: 8:00 - 20:00 hàng ngày.'
      },
      {
        q: 'Cửa hàng có giao máy tận nơi không?',
        a: 'Có, chúng tôi hỗ trợ giao máy trong nội thành TP.HCM với phí ship từ 30.000đ - 50.000đ tùy khoảng cách. Đơn hàng từ 2.000.000đ được miễn phí giao hàng.'
      },
      {
        q: 'Giờ mở cửa là mấy giờ?',
        a: 'Cửa hàng mở cửa từ 8:00 đến 20:00 các ngày trong tuần (Thứ 2 - Thứ 6) và 9:00 - 18:00 cuối tuần (Thứ 7, Chủ Nhật).'
      }
    ]
  },
  {
    category: 'Tài khoản & Đăng nhập',
    questions: [
      {
        q: 'Tôi có cần đăng ký tài khoản để thuê máy không?',
        a: 'Bạn nên đăng ký tài khoản để dễ dàng theo dõi đơn hàng, lịch sử thuê và nhận các ưu đãi đặc biệt. Tuy nhiên, bạn vẫn có thể đặt hàng với tư cách khách vãng lai.'
      },
      {
        q: 'Làm sao để đặt lại mật khẩu?',
        a: 'Nhấn vào "Quên mật khẩu" trên trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn.'
      },
      {
        q: 'Tôi có thể đăng nhập bằng Google không?',
        a: 'Có, bạn có thể đăng nhập nhanh bằng tài khoản Google chỉ với một click. Không cần nhớ mật khẩu!'
      }
    ]
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = activeCategory === 'all'
    ? faqData
    : faqData.filter(cat => cat.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-3">Câu hỏi thường gặp</h1>
          <p className="text-gray-400 text-lg">Tìm câu trả lời nhanh cho những thắc mắc của bạn</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            Tất cả
          </button>
          {faqData.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                activeCategory === cat.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredData.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">
                  {catIndex + 1}
                </span>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={qIndex}
                      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{item.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-4 text-gray-400 leading-relaxed border-t border-gray-700 pt-4">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Không tìm thấy câu trả lời?</h3>
          <p className="text-blue-100 mb-6">Liên hệ với chúng tôi, đội ngũ hỗ trợ sẵn sàng giúp bạn 24/7</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:0943029660"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              📞 Gọi ngay: 0943 029 660
            </a>
            <a
              href="https://www.facebook.com/tinh.lvo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors"
            >
              💬 Chat Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

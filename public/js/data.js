// ============================================================
// LICENSES — Tiêu chuẩn theo TT 04/2022/TT-BGTVT & CV 3207
// ============================================================
const LICENSES = [
  { id:'A1', cat:'cat-a', color:'#FF6B35', title:'Bằng A1', desc:'Xe máy dung tích 50cm³ đến dưới 175cm³', questions:25, time:15, pass:21, difficulty:'easy',   vehicle:'🛵' },
  { id:'A2', cat:'cat-a', color:'#FF6B35', title:'Bằng A2', desc:'Xe máy trên 175cm³, xe 3 bánh người khuyết tật', questions:25, time:15, pass:23, difficulty:'medium', vehicle:'🏍️' },
  { id:'B1', cat:'cat-b', color:'#0052CC', title:'Bằng B1', desc:'Ô tô không kinh doanh vận tải dưới 9 chỗ', questions:30, time:20, pass:27, difficulty:'medium', vehicle:'🚗' },
  { id:'B2', cat:'cat-b', color:'#0052CC', title:'Bằng B2', desc:'Ô tô kinh doanh vận tải dưới 9 chỗ, xe tải dưới 3.5 tấn', questions:35, time:22, pass:32, difficulty:'medium', vehicle:'🚕' },
  { id:'C',  cat:'cat-c', color:'#0A9E6E', title:'Bằng C',  desc:'Xe tải, máy kéo trên 3.5 tấn, xe chuyên dụng', questions:40, time:24, pass:36, difficulty:'hard',   vehicle:'🚛' },
  { id:'D',  cat:'cat-d', color:'#7B3FF2', title:'Bằng D',  desc:'Xe khách từ 10–30 chỗ ngồi', questions:45, time:26, pass:41, difficulty:'hard',   vehicle:'🚌' },
];

// Nhóm tag tiện ích
const ALL = ['A1','A2','B1','B2','C','D'];
const AUTO = ['B1','B2','C','D'];
const MOTO = ['A1','A2'];

// ============================================================
// QUESTION BANK (Bộ câu hỏi đầy đủ)
// ============================================================
// ============================================================
// QUESTION BANK (Bộ câu hỏi đã chuẩn hóa câu điểm liệt)
// ============================================================
const QUESTIONS = [
  // ── NHÓM CÂU ĐIỂM LIỆT CHUẨN (critical: true) ───────────────
  {
    id: 1, critical: true, tags: ALL,
    text: 'Theo quy định, người điều khiển xe cơ giới tuyệt đối không được có nồng độ cồn trong máu hoặc hơi thở ở mức nào?',
    options: ['Dưới 50mg/100ml máu', 'Dưới 80mg/100ml máu', 'Bất kỳ nồng độ nào (mức 0)', 'Dưới 30mg/100ml máu'],
    correct: 2,
    explain: 'Nghị định quy định cấm tuyệt đối người điều khiển xe cơ giới tham gia giao thông mà trong máu hoặc hơi thở có nồng độ cồn.'
  },
  {
    id: 2, critical: true, tags: ALL,
    text: 'Hành vi nào dưới đây bị coi là điểm liệt trong kỳ thi sát hạch lý thuyết lái xe?',
    options: ['Không nhớ tên biển báo phụ', 'Sử dụng ma túy khi điều khiển xe', 'Không biết quy trình kiểm tra xe', 'Không thuộc tên các loại đường'],
    correct: 1,
    explain: 'Sử dụng ma túy khi điều khiển phương tiện là hành vi cực kỳ nguy hiểm, bị nghiêm cấm và là câu hỏi điểm liệt.'
  },
  {
    id: 3, critical: true, tags: ALL,
    text: 'Người lái xe được phép vượt xe khác trong trường hợp nào sau đây?',
    options: ['Khi đang qua cầu hẹp một làn xe', 'Khi đường thẳng, tầm nhìn xa, làn ngược chiều trống', 'Khi có đường giao nhau phía trước 50m', 'Khi xe trước đang dừng nhường đường cho người đi bộ'],
    correct: 1,
    explain: 'Chỉ được vượt khi đường thẳng, đủ điều kiện an toàn, không có chướng ngại vật phía trước và làn ngược chiều trống.'
  },
  {
    id: 4, critical: true, tags: AUTO,
    text: 'Khi xe bị mất phanh khi đang xuống dốc dài, người lái xe phải xử lý thế nào đầu tiên?',
    options: ['Tắt máy ngay lập tức', 'Mở cửa xe và nhảy xuống', 'Giảm số liên tục, dùng phanh tay hợp lý, lái vào vệ đường an toàn', 'Bấm còi liên tục và giữ nguyên tốc độ'],
    correct: 2,
    explain: 'Phải về số thấp để hãm bằng động cơ, dùng phanh tay từ từ và điều khiển xe vào lề đường an toàn.'
  },
  {
    id: 5, critical: true, tags: ALL,
    text: 'Người điều khiển phương tiện gặp đèn tín hiệu màu đỏ thì phải làm gì?',
    options: ['Giảm tốc độ và cẩn thận đi qua', 'Dừng lại trước vạch dừng xe', 'Đi chậm qua nếu đường vắng', 'Chỉ dừng khi có cảnh sát'],
    correct: 1,
    explain: 'Đèn đỏ bắt buộc phải dừng lại trước vạch dừng. Cố tình vượt đèn đỏ bị nghiêm cấm.'
  },
  {
    id: 6, critical: true, tags: ALL,
    text: 'Cuộc đua xe cơ giới chỉ được thực hiện khi nào?',
    options: ['Diễn ra trên đường phố vắng người', 'Được người dân ủng hộ', 'Được cơ quan có thẩm quyền cấp phép'],
    correct: 2,
    explain: 'Mọi cuộc đua xe phải được cơ quan Nhà nước có thẩm quyền cấp phép.'
  },
  {
    id: 7, critical: true, tags: ALL,
    text: 'Hành vi điều khiển xe cơ giới chạy quá tốc độ quy định, giành đường, vượt ẩu có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm tùy trường hợp', 'Bị nghiêm cấm', 'Không bị nghiêm cấm'],
    correct: 1,
    explain: 'Phóng nhanh, giành đường, vượt ẩu là nguyên nhân chính gây tai nạn giao thông nghiêm trọng nên bị cấm tuyệt đối.'
  },
  {
    id: 8, critical: true, tags: ALL,
    text: 'Khi xảy ra tai nạn giao thông, người lái xe có hành vi bỏ trốn để trốn tránh trách nhiệm có bị nghiêm cấm không?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Được phép nếu sợ bị hành hung'],
    correct: 1,
    explain: 'Bỏ trốn sau khi gây tai nạn để trốn tránh trách nhiệm là hành vi vi phạm pháp luật nghiêm trọng.'
  },
  {
    id: 9, critical: true, tags: ALL,
    text: 'Hành vi giao xe cơ giới cho người không đủ điều kiện điều khiển tham gia giao thông có được phép không?',
    options: ['Được phép', 'Không được phép', 'Được phép nếu là người trong gia đình'],
    correct: 1,
    explain: 'Tuyệt đối không giao xe cho người chưa có bằng lái, chưa đủ tuổi hoặc đang có nồng độ cồn/ma túy.'
  },
  {
    id: 10, critical: true, tags: MOTO,
    text: 'Hành vi buông cả hai tay khi đang điều khiển xe mô tô tham gia giao thông bị xử lý thế nào?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Chỉ bị nhắc nhở'],
    correct: 1,
    explain: 'Buông cả hai tay làm mất hoàn toàn khả năng làm chủ phương tiện, bị cấm tuyệt đối.'
  },
  {
    id: 11, critical: true, tags: MOTO,
    text: 'Hành vi đi xe máy bốc đầu, đi xe bằng một bánh có bị nghiêm cấm không?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Được phép ở đường nông thôn'],
    correct: 1,
    explain: 'Điều khiển xe máy bằng một bánh là hành vi gây nguy hiểm nghiêm trọng đến tính mạng.'
  },
  {
    id: 12, critical: true, tags: AUTO,
    text: 'Khi điều khiển xe ô tô qua đường sắt không có rào chắn, nếu thấy đèn đỏ sáng hoặc chuông báo thì phải làm gì?',
    options: [
      'Tăng ga vượt nhanh qua đường sắt',
      'Dừng xe ngay lại và giữ khoảng cách tối thiểu 5m tính từ ray gần nhất',
      'Giảm tốc độ quan sát rồi đi tiếp'
    ],
    correct: 1,
    explain: 'Bắt buộc dừng xe trước vạch dừng hoặc cách đường ray gần nhất tối thiểu 5 mét.'
  },
  {
    id: 13, critical: true, tags: ALL,
    text: 'Ở những nơi nào dưới đây KHÔNG ĐƯỢC PHÉP quay đầu xe?',
    options: [
      'Ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu dốc, đường sắt',
      'Ở ngã tư giao nhau',
      'Ở nơi có biển báo cho phép quay đầu'
    ],
    correct: 0,
    explain: 'Cấm quay đầu tại phần đường cho người đi bộ, trên cầu, gầm cầu vượt, ngầm, hầm, đầu dốc, đường cong hẹp, đường sắt.'
  },
  {
    id: 14, critical: true, tags: ALL,
    text: 'Khi điều khiển xe trên đường cao tốc, hành vi nào dưới đây bị nghiêm cấm?',
    options: [
      'Lùi xe, đi ngược chiều trên đường cao tốc',
      'Chạy đúng tốc độ quy định',
      'Đi đúng làn đường quy định'
    ],
    correct: 0,
    explain: 'Quay đầu, lùi xe hoặc đi ngược chiều trên cao tốc là hành vi cực kỳ nguy hiểm, bị cấm tuyệt đối.'
  },
  {
    id: 15, critical: true, tags: AUTO,
    text: 'Khi lái xe ô tô xuống dốc dài và độ dốc cao, người lái xe phải thực hiện thao tác nào để đảm bảo an toàn?',
    options: [
      'Về số thấp (về số 1 hoặc L), kết hợp phanh chân khống chế tốc độ',
      'Về số 0 (N) và đạp phanh liên tục',
      'Tắt chìa khóa điện và thả trôi xe'
    ],
    correct: 0,
    explain: 'Tuyệt đối không về số N hoặc tắt máy khi xuống dốc vì sẽ làm mất trợ lực phanh và gây cháy má phanh.'
  },
  {
    id: 16, critical: true, tags: AUTO,
    text: 'Người lái xe ô tô không được dừng, đỗ xe tại các vị trí nào sau đây?',
    options: [
      'Bên trái đường một chiều, trên cầu, gầm cầu vượt, song song với xe khác đang dừng đỗ',
      'Tại nơi có biển cấm đỗ xe',
      'Cả hai ý trên'
    ],
    correct: 2,
    explain: 'Cấm dừng đỗ tại vị trí khuất tầm nhìn, gầm cầu, trên cầu, bên trái đường một chiều và nơi có biển cấm.'
  },
  {
    id: 17, critical: true, tags: MOTO,
    text: 'Hành vi sử dụng chân chống hoặc vật khác quẹt xuống đường khi xe đang chạy bị xử lý thế nào?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Chỉ bị nhắc nhở'],
    correct: 1,
    explain: 'Sử dụng chân chống quẹt xuống đường dễ gây té ngã thảm khốc cho bản thân và người sau.'
  },
  {
    id: 18, critical: true, tags: ALL,
    text: 'Hành vi tự ý thay đổi kết cấu, tổng thành của xe, độ còi hơi, đèn siêu sáng có được phép không?',
    options: ['Được phép', 'Không được phép', 'Được phép nếu đi đường đêm'],
    correct: 1,
    explain: 'Tự ý thay đổi kết cấu xe hoặc lắp thêm đèn, còi sai thiết kế nhà sản xuất là hành vi bị nghiêm cấm.'
  },
  {
    id: 19, critical: true, tags: ALL,
    text: 'Khi thấy xe ưu tiên đang phát tín hiệu làm nhiệm vụ, người tham gia giao thông phải làm gì?',
    options: [
      'Tăng tốc chạy trước xe ưu tiên',
      'Nhanh chóng giảm tốc độ, tránh hoặc dừng lại sát vệ đường bên phải để nhường đường',
      'Đi bình thường vì xe ưu tiên sẽ tự tránh'
    ],
    correct: 1,
    explain: 'Phải lập tức giảm tốc, tạt sát lề đường bên phải và dừng lại nhường đường, không cản trở.'
  },
  {
    id: 20, critical: true, tags: AUTO,
    text: 'Khi xe ô tô đi qua hầm đường bộ, người lái xe phải tuân thủ quy định nào dưới đây?',
    options: [
      'Bật đèn chiếu sáng (đèn cos), không được quay đầu xe, lùi xe trong hầm',
      'Bật đèn khẩn cấp và quay đầu xe nếu đi nhầm đường',
      'Tắt đèn để tiết kiệm điện năng'
    ],
    correct: 0,
    explain: 'Vào hầm bắt buộc bật đèn chiếu gần, cấm quay đầu, lùi xe hoặc vượt xe trong hầm.'
  },
  {
    id: 21, critical: true, tags: AUTO,
    text: 'Khi mở cửa xe ô tô để bước xuống, người lái xe phải thực hiện thao tác nào để an toàn?',
    options: [
      'Mở rộng cửa xe ngay lập tức để bước ra nhanh',
      'Quan sát phía trước và phía sau qua gương, mở hé cửa khi an toàn mới mở đủ để bước ra',
      'Chỉ cần bấm đèn khẩn cấp rồi mở cửa'
    ],
    correct: 1,
    explain: 'Phải ngoái đầu quan sát điểm mù phía sau, mở hé cửa để cảnh báo phương tiện tới gần trước khi bước ra.'
  },
  {
    id: 22, critical: true, tags: ALL,
    text: 'Người lái xe không được vượt xe khác ở những khu vực nào sau đây?',
    options: [
      'Trên cầu hẹp một làn xe, đường cong hẹp, đầu dốc, nơi tầm nhìn bị che khuất',
      'Trên đường thẳng rộng có 2 làn xe',
      'Nơi đường vắng người'
    ],
    correct: 0,
    explain: 'Cấm vượt ở cầu 1 làn, đường cong khuất tầm nhìn, đầu dốc và nơi giao nhau.'
  },
  {
    id: 23, critical: true, tags: ALL,
    text: 'Hành vi phá hoại công trình giao thông đường bộ, tháo dỡ biển báo giao thông bị xử lý thế nào?',
    options: ['Bị nghiêm cấm', 'Được phép nếu dọn dẹp đường', 'Không bị cấm'],
    correct: 0,
    explain: 'Tháo dỡ, phá hoại kết cấu hạ tầng giao thông bị cấm tuyệt đối và xử lý hình sự.'
  },
  {
    id: 24, critical: true, tags: ALL,
    text: 'Khi gặp biển báo "CẤM ĐI NGƯỢC CHUYỀN", người điều khiển phương tiện có được đi vào không?',
    options: ['Tuyệt đối không được đi vào', 'Được đi vào nếu xe vắng', 'Được đi vào nếu đi chậm'],
    correct: 0,
    explain: 'Đi vào đường có biển cấm đi ngược chiều nguy cơ gây va chạm diện rộng, nghiêm cấm.'
  },
  {
    id: 25, critical: true, tags: ALL,
    text: 'Hành vi điều khiển phương tiện giao thông lạng lách, đánh võng trên đường bộ có bị nghiêm cấm không?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Chỉ cấm ở thành phố'],
    correct: 1,
    explain: 'Lạng lách đánh võng đe doạ tính mạng người tham gia giao thông nên bị cấm nghiêm ngặt.'
  },

  // ── NHÓM CÂU THÔNG THƯỜNG (critical: từ 26 đến 75 đều là false) ──
  {
    id: 26, critical: false, tags: ALL,
    text: 'Khi đang lái xe, nếu phát hiện xe phía trước có tín hiệu xin vượt, người lái xe phải làm gì nếu đủ điều kiện an toàn?',
    options: [
      'Tăng tốc độ để xe sau không vượt được',
      'Giảm tốc độ, đi sát về bên phải phần đường của mình cho đến khi xe sau đã vượt qua',
      'Cho xe đi sang làn đường bên trái để nhường đường'
    ],
    correct: 1,
    explain: 'Nếu đủ điều kiện an toàn, người lái xe phía trước phải giảm tốc độ, đi sát về bên phải lề đường để nhường.'
  },
  {
    id: 27, critical: false, tags: ALL,
    text: 'Hành vi cản trở, cản trở bất hợp pháp xe ưu tiên đang phát tín hiệu đi làm nhiệm vụ bị xử lý thế nào?',
    options: ['Không bị cấm', 'Bị nghiêm cấm', 'Chỉ bị nhắc nhở'],
    correct: 1,
    explain: 'Cố tình cản trở xe ưu tiên làm nhiệm vụ (chữa cháy, cứu thương...) bị phạt tiền nặng và tước bằng lái.'
  },
  {
    id: 28, critical: false, tags: MOTO,
    text: 'Người ngồi trên xe mô tô hai bánh, xe gắn máy không được thực hiện hành vi nào dưới đây?',
    options: [
      'Đội mũ bảo hiểm và cài dây đúng quy cách',
      'Sử dụng ô (dù), kéo đẩy phương tiện khác, đứng trên yên xe',
      'Thắt dây an toàn'
    ],
    correct: 1,
    explain: 'Sử dụng ô/dù, kéo đẩy xe khác, đứng trên yên xe khi đang chạy bị nghiêm cấm vì gây tai nạn.'
  },
  {
    id: 29, critical: false, tags: AUTO,
    text: 'Khi ô tô bị hư hỏng tại vị trí đường sắt giao cắt, người lái xe phải xử lý như thế nào ngay lập tức?',
    options: [
      'Nhanh chóng đặt biển báo hiệu trên đường sắt cách tối thiểu 500m về hai phía và phát tín hiệu khẩn cấp',
      'Ngồi trên xe bấm còi liên tục',
      'Cố gắng khởi động lại xe không dừng'
    ],
    correct: 0,
    explain: 'Phải nhanh chóng đưa người ra khỏi xe, báo tín hiệu dừng tàu khẩn cấp cách vị trí xe tối thiểu 500m về 2 phía.'
  },
  {
    id: 30, critical: false, tags: AUTO,
    text: 'Người lái xe ô tô chở người trên 9 chỗ ngồi không được liên tục điều khiển xe quá bao nhiêu giờ?',
    options: ['Không quá 4 giờ', 'Không quá 8 giờ', 'Không quá 6 giờ'],
    correct: 0,
    explain: 'Thời gian làm việc liên tục của người lái xe ô tô không được vượt quá 4 giờ để tránh mệt mỏi gây tai nạn.'
  },
  {
    id: 31, critical: false, tags: ALL,
    text: 'Khi xe ô tô gặp sự cố đột ngột trên đường cao tốc, người lái phải làm gì đầu tiên?',
    options: [
      'Dừng xe ngay trên làn xe đang chạy',
      'Bật đèn khẩn cấp, đưa xe vào làn dừng khẩn cấp, đặt biển cảnh báo phía sau tối thiểu 150m',
      'Bước xuống xe đứng giữa đường vẫy xe hỗ trợ'
    ],
    correct: 1,
    explain: 'Phải bật đèn hazard, tạt xe vào làn khẩn cấp và đặt biển cảnh báo nguy hiểm cách xe ít nhất 150m.'
  },
  {
    id: 32, critical: false, tags: ALL,
    text: 'Hành vi vận chuyển hàng cấm, hàng nguy hiểm trái phép trên đường bộ có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Được phép nếu bọc kín', 'Không bị cấm'],
    correct: 0,
    explain: 'Vận chuyển chất cháy nổ, hàng cấm trái phép là hành vi vi phạm nghiêm trọng luật giao thông.'
  },
  {
    id: 33, critical: false, tags: ALL,
    text: 'Người lái xe không được phép quay đầu xe tại nơi nào sau đây?',
    options: [
      'Trong hầm đường bộ',
      'Tại nơi đường giao nhau',
      'Tại nơi có biển chỉ dẫn quay đầu'
    ],
    correct: 0,
    explain: 'Trong hầm đường bộ cấm quay đầu, lùi xe và vượt xe tuyệt đối.'
  },
  {
    id: 34, critical: false, tags: AUTO,
    text: 'Khi điều khiển xe ô tô rẽ phải tại ngã tư, người lái xe phải thực hiện quy trình nào để an toàn?',
    options: [
      'Bật xi nhan rẽ phải, quan sát gương bên phải/điểm mù, nhường đường cho xe đi thẳng và người đi bộ',
      'Tăng tốc rẽ nhanh qua ngã tư',
      'Bật xi nhan rồi rẽ ngay không cần giảm tốc'
    ],
    correct: 0,
    explain: 'Phải phát tín hiệu rẽ, giảm tốc, quan sát điểm mù bên phải và nhường đường cho xe đi thẳng/người đi bộ.'
  },
  {
    id: 35, critical: false, tags: AUTO,
    text: 'Khi xuống dốc cao, người lái xe số tự động (AT) cần làm gì để hãm xe an toàn?',
    options: [
      'Chuyển sang số bán tự động (L, D1, D2 hoặc M-) để động cơ hãm tốc',
      'Giữ nguyên số D và đạp phanh đĩa liên tục',
      'Về số N (số trung gian)'
    ],
    correct: 0,
    explain: 'Xe tự động cần chuyển về các cấp số thấp (L, D1, D2) để lấy sức ghì phanh động cơ khi xuống dốc.'
  },
  {
    id: 36, critical: false, tags: ALL,
    text: 'Hành vi bấm còi liên tục, bấm còi hơi trong khu đô thị từ 22 giờ đêm đến 5 giờ sáng có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Không bị cấm', 'Được phép khi vội'],
    correct: 0,
    explain: 'Sử dụng còi hơi, bấm còi liên tục trong đô thị từ 22h đêm tới 5h sáng bị nghiêm cấm.'
  },
  {
    id: 37, critical: false, tags: ALL,
    text: 'Người lái xe có được lùi xe ở khu vực đường dừng đón trả khách của xe buýt không?',
    options: ['Không được lùi xe', 'Được phép nếu vắng xe', 'Được lùi khi có người xi-nhan'],
    correct: 0,
    explain: 'Cấm lùi xe tại nơi đường giao nhau, khu vực dừng đón trả khách của xe buýt, hầm và đường cao tốc.'
  },
  {
    id: 38, critical: false, tags: ALL,
    text: 'Khi điều khiển xe chạy trên đường, hành vi kéo, đẩy phương tiện khác có được phép không?',
    options: ['Tuyệt đối không được phép', 'Được phép nếu xe kia bị hỏng', 'Được phép vào ban ngày'],
    correct: 0,
    explain: 'Cấm kéo, đẩy phương tiện khác không đúng quy định kỹ thuật vì nguy cơ đứt dây, gây tai nạn thảm khốc.'
  },
  {
    id: 39, critical: false, tags: ALL,
    text: 'Trên đường có nhiều làn xe, khi chuyển làn đường người lái xe phải thực hiện thế nào?',
    options: [
      'Chuyển làn ngay khi thấy khoảng trống',
      'Chỉ được chuyển làn ở nơi cho phép, phải có tín hiệu báo trước và bảo đảm an toàn',
      'Bấm còi và chuyển làn lập tức'
    ],
    correct: 1,
    explain: 'Chỉ được chuyển làn ở nơi vạch nét đứt, bật xi nhan và quan sát an toàn tuyệt đối mới chuyển.'
  },
  {
    id: 40, critical: false, tags: AUTO,
    text: 'Khi phanh xe ô tô có hệ thống phanh chống bó cứng (ABS) trên đường trơn trượt, người lái xe phải phanh thế nào?',
    options: [
      'Đạp phanh dứt khoát và giữ chặt chân phanh',
      'Đạp nhấp nhả phanh liên tục',
      'Kéo phanh tay dứt khoát'
    ],
    correct: 0,
    explain: 'Hệ thống ABS sẽ tự động nhấp nhả phanh hàng chục lần/giây. Người lái chỉ cần đạp giữ chặt phanh dứt khoát.'
  },
  {
    id: 41, critical: false, tags: MOTO,
    text: 'Người điều khiển xe mô tô hai bánh có được phép chở 3 người trên xe trong trường hợp nào dưới đây?',
    options: [
      'Chở người bệnh đi cấp cứu, trẻ em dưới 14 tuổi hoặc áp giải người có hành vi vi phạm pháp luật',
      'Chở người thân trong gia đình đi chơi',
      'Không được chở 3 trong bất kỳ trường hợp nào'
    ],
    correct: 0,
    explain: 'Xe máy chỉ chở tối đa 1 người, trừ 3 trường hợp ngoại lệ: cấp cứu, trẻ dưới 14 tuổi, áp giải tội phạm.'
  },
  {
    id: 42, critical: false, tags: ALL,
    text: 'Hành vi bỏ mặc người bị tai nạn giao thông không cứu giúp khi có điều kiện có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Không bị cấm', 'Tùy thuộc mối quan hệ'],
    correct: 0,
    explain: 'Thấy người bị nạn giao thông nguy cấp mà không cứu giúp là vi phạm đạo đức và Luật Hình sự.'
  },
  {
    id: 43, critical: false, tags: ALL,
    text: 'Nơi có biển báo "CẤM VƯỢT", người lái xe có được phép vượt xe khác không?',
    options: ['Tuyệt đối không được vượt', 'Được vượt nếu xe trước đi chậm', 'Được vượt khi đường vắng'],
    correct: 0,
    explain: 'Đã có biển cấm vượt thì tuyệt đối không được thực hiện hành vi vượt xe.'
  },
  {
    id: 44, critical: false, tags: AUTO,
    text: 'Khi khởi hành ô tô số sàn trên dốc đứng, thao tác thả phanh tay phải thực hiện khi nào?',
    options: [
      'Khi côn đã bám (máy rung nhẹ và có lực kéo)',
      'Thả phanh tay trước rồi mới đạp ga',
      'Thả phanh tay đồng thời tắt máy'
    ],
    correct: 0,
    explain: 'Phải nhả côn tới điểm bám (máy rung nhẹ) rồi mới nhả phanh tay để xe không bị trôi lùi về sau.'
  },
  {
    id: 45, critical: false, tags: AUTO,
    text: 'Khi đang lái xe ô tô, nếu muốn sử dụng điện thoại di động người lái xe phải làm gì?',
    options: [
      'Giảm tốc độ, dừng xe ở nơi an toàn theo quy định rồi mới sử dụng điện thoại',
      'Vừa lái xe vừa nghe điện thoại bằng một tay',
      'Dùng điện thoại đi chậm giữa đường'
    ],
    correct: 0,
    explain: 'Cấm dùng điện thoại khi lái xe. Muốn nghe/gọi phải dừng xe an toàn đúng nơi quy định.'
  },
  {
    id: 46, critical: false, tags: ALL,
    text: 'Khi qua ngã tư có vòng xuyến, người lái xe phải nhường đường cho xe nào?',
    options: [
      'Nhường đường cho xe đi đến từ bên trái',
      'Nhường đường cho xe đi đến từ bên phải',
      'Không cần nhường đường'
    ],
    correct: 0,
    explain: 'Tại giao lộ có báo hiệu đi theo vòng xuyến, phải nhường đường cho xe đi đến từ bên trái.'
  },
  {
    id: 47, critical: false, tags: ALL,
    text: 'Xe cấp cứu đang phát tín hiệu ưu tiên đi qua ngã tư đèn đỏ, các phương tiện khác phải làm gì?',
    options: [
      'Giảm tốc độ, nhường đường cho xe cấp cứu đi qua',
      'Đi bình thường vì mình đang đèn xanh',
      'Tăng tốc đi trước xe cấp cứu'
    ],
    correct: 0,
    explain: 'Mọi phương tiện bắt buộc nhường đường cho xe ưu tiên đang phát tín hiệu làm nhiệm vụ.'
  },
  {
    id: 48, critical: false, tags: ALL,
    text: 'Hành vi đi xe cơ giới lên vỉa hè dành cho người đi bộ có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Được phép khi tắc đường', 'Được phép vào giờ cao điểm'],
    correct: 0,
    explain: 'Cấm điều khiển xe đi trên vỉa hè, trừ trường hợp đi qua vỉa hè để vào nhà hay cổng cơ quan.'
  },
  {
    id: 49, critical: false, tags: AUTO,
    text: 'Khi ô tô bị nổ lốp bánh trước bên trái khi đang chạy tốc độ cao, người lái xe phải xử lý thế nào?',
    options: [
      'Giữ chặt vô lăng, giữ thẳng lái, nhả ga và từ từ rà phanh dừng vào lề',
      'Đạp phanh gấp lập tức',
      'Đánh mạnh vô lăng sang phải'
    ],
    correct: 0,
    explain: 'Nổ lốp tuyệt đối không phanh gấp hay đánh lái ngoặt. Phải giữ chặt vô lăng thẳng lái, giảm ga rà phanh.'
  },
  {
    id: 50, critical: false, tags: ALL,
    text: 'Tại đường giao nhau không có vạch kẻ cho người đi bộ, người lái xe có phải nhường đường cho người đi bộ không?',
    options: [
      'Bắt buộc phải nhường đường cho người đi bộ đang sang đường',
      'Không phải nhường đường',
      'Chỉ nhường nếu có cảnh sát giao thông'
    ],
    correct: 0,
    explain: 'Người lái xe phải quan sát, giảm tốc độ và nhường đường cho người đi bộ đang sang đường.'
  },
  {
    id: 51, critical: false, tags: AUTO,
    text: 'Khi điều khiển xe ô tô trong mưa lớn hoặc sương mù dày đặc, người lái xe phải xử lý thế nào?',
    options: [
      'Giảm tốc độ, bật đèn chiếu gần (cos) và đèn sương mù, giữ khoảng cách an toàn',
      'Bật đèn pha chiếu xa để nhìn rõ hơn',
      'Tăng tốc vượt nhanh khỏi khu vực sương mù'
    ],
    correct: 0,
    explain: 'Trời mưa/sương mù phải bật đèn cos/đèn sương mù, cấm bật đèn pha (chiếu xa) vì gây phản xạ chói lóa.'
  },
  {
    id: 52, critical: false, tags: ALL,
    text: 'Hành vi chèn ép, không cho xe sau vượt khi xe sau đã có tín hiệu xin vượt an toàn có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Không bị cấm', 'Tùy thuộc độ rộng mặt đường'],
    correct: 0,
    explain: 'Cố tình ngáng đường, chèn ép không cho xe sau vượt khi đủ điều kiện an toàn bị cấm nghiêm ngặt.'
  },
  {
    id: 53, critical: false, tags: ALL,
    text: 'Nơi đường giao nhau giữa đường ưu tiên và đường không ưu tiên, xe ở đường nào phải nhường đường?',
    options: [
      'Xe đi từ đường không ưu tiên phải nhường đường cho xe trên đường ưu tiên',
      'Xe đi từ đường ưu tiên phải nhường đường',
      'Xe nào lớn hơn thì được đi trước'
    ],
    correct: 0,
    explain: 'Xe đi từ đường nhánh/không ưu tiên phải nhường đường cho xe trên đường ưu tiên từ bất kỳ hướng nào tới.'
  },
  {
    id: 54, critical: false, tags: AUTO,
    text: 'Khi lùi xe ô tô, người lái xe phải làm gì để đảm bảo an toàn tuyệt đối?',
    options: [
      'Quan sát phía sau, quay đầu quan sát điểm mù hoặc dùng camera/cảm biến lùi và lùi với tốc độ chậm',
      'Chỉ nhìn gương chiếu hậu bên trái rồi lùi nhanh',
      'Nhấn ga lùi nhanh qua đoạn vắng'
    ],
    correct: 0,
    explain: 'Lùi xe phải quan sát kĩ điểm mù phía sau, phát tín hiệu và chỉ lùi khi thấy an toàn.'
  },
  {
    id: 55, critical: false, tags: MOTO,
    text: 'Người điều khiển xe máy điện có bắt buộc phải đội mũ bảo hiểm cài quy cách không?',
    options: ['Bắt buộc phải đội mũ bảo hiểm', 'Không bắt buộc', 'Chỉ bắt buộc trên quốc lộ'],
    correct: 0,
    explain: 'Người đi xe máy điện, xe đạp điện bắt buộc đội mũ bảo hiểm đạt chuẩn mọi lúc.'
  },
  {
    id: 56, critical: false, tags: AUTO,
    text: 'Hành vi chở quá số người quy định trên xe ô tô khách có bị nghiêm cấm không?',
    options: ['Bị nghiêm cấm', 'Được phép vào dịp lễ tết', 'Không bị cấm'],
    correct: 0,
    explain: 'Chở quá số lượng hành khách nguy cơ gây mất an toàn nghiêm trọng, bị nghiêm cấm.'
  },
  {
    id: 57, critical: false, tags: ALL,
    text: 'Tại nơi đường bộ giao nhau cùng cấp với đường sắt, phương tiện nào được quyền ưu tiên đi trước?',
    options: [
      'Phương tiện giao thông đường sắt',
      'Xe chữa cháy đang làm nhiệm vụ',
      'Xe cứu thương đang làm nhiệm vụ'
    ],
    correct: 0,
    explain: 'Phương tiện giao thông đường sắt luôn luôn được quyền ưu tiên tuyệt đối tại điểm giao cắt.'
  },
  {
    id: 58, critical: false, tags: AUTO,
    text: 'Khi lái xe ô tô qua đoạn đường ngập nước sâu, người lái xe nên xử lý như thế nào?',
    options: [
      'Tắt điều hòa, về số thấp (số 1/L), giữ đều ga cho xe qua từ từ',
      'Tăng ga thật mạnh để vượt nhanh',
      'Đạp sâu phanh và chuyển số liên tục'
    ],
    correct: 0,
    explain: 'Ngập nước phải tắt điều hòa, về số 1/L, giữ đều ga tránh thốc ga làm nước tràn vào cổ hút gây thủy kích.'
  },
  {
    id: 59, critical: false, tags: ALL,
    text: 'Hành vi điều khiển xe cơ giới không có Giấy đăng ký xe theo quy định bị xử lý thế nào?',
    options: ['Bị nghiêm cấm và xử phạt vi phạm', 'Được phép nếu xe mới mua', 'Chỉ bị nhắc nhở'],
    correct: 0,
    explain: 'Điều khiển phương tiện không có đăng ký xe hợp lệ là hành vi vi phạm pháp luật bị cấm.'
  },
  {
    id: 60, critical: false, tags: ALL,
    text: 'Khi xảy ra tai nạn giao thông có người bị thương nặng, người lái xe phải có trách nhiệm gì?',
    options: [
      'Cứu chữa người bị thương, giữ nguyên hiện trường và báo ngay cho cơ quan công an',
      'Rời khỏi hiện trường ngay lập tức',
      'Chờ người nhà nạn nhân đến mới cấp cứu'
    ],
    correct: 0,
    explain: 'Trách nhiệm sơ cứu người bị nạn, bảo vệ hiện trường và báo cho cơ quan công an gần nhất.'
  },
  {
    id: 61, critical: false, tags: ALL,
    text: 'Khi gặp biển báo "STOP" (Dừng lại), người lái xe phải xử lý như thế nào?',
    options: ['Giảm tốc xuống dưới 40km/h', 'Dừng hẳn trước vạch, nhường đường cho phương tiện khác', 'Quan sát rồi đi tiếp không cần dừng', 'Bật xi nhan và đi chậm qua'],
    correct: 1,
    explain: 'Biển R.122 "STOP" yêu cầu dừng hẳn xe trước vạch kẻ đường, quan sát và nhường đường cho tất cả phương tiện đang lưu thông có quyền ưu tiên.'
  },
  {
    id: 62, critical: false, tags: ALL,
    text: 'Tại ngã tư không có tín hiệu điều khiển giao thông, xe nào được quyền đi trước?',
    options: ['Xe đến từ bên trái', 'Xe có tải trọng lớn hơn', 'Xe đến từ bên phải', 'Xe đến trước'],
    correct: 2,
    explain: 'Quy tắc "nhường đường bên phải": tại ngã tư không có tín hiệu, xe đến từ phía bên phải mình được ưu tiên qua trước.'
  },
  {
    id: 63, critical: false, tags: ALL,
    text: 'Người đi bộ qua đường tại vạch sang đường (vạch zebra) có được ưu tiên không?',
    options: ['Chỉ khi có đèn xanh', 'Luôn được ưu tiên, mọi phương tiện phải nhường', 'Chỉ vào ban ngày', 'Chỉ khi không có phương tiện trong 100m'],
    correct: 1,
    explain: 'Người đi bộ qua đường tại vạch kẻ được ưu tiên. Người lái xe phải giảm tốc hoặc dừng nhường đường.'
  },
  {
    id: 64, critical: false, tags: AUTO,
    text: 'Tốc độ tối đa cho phép của ô tô con trên đường cao tốc là bao nhiêu km/h?',
    options: ['80 km/h', '100 km/h', '120 km/h', '110 km/h'],
    correct: 2,
    explain: 'Thông tư 31/2019/TT-BGTVT: tốc độ tối đa trên đường cao tốc với xe con là 120 km/h.'
  },
  {
    id: 65, critical: false, tags: AUTO,
    text: 'Khoảng cách an toàn tối thiểu giữa các xe khi chạy tốc độ 60 km/h là bao nhiêu mét?',
    options: ['35 mét', '55 mét', '25 mét', '40 mét'],
    correct: 0,
    explain: 'Khoảng cách an toàn khi chạy 60 km/h tối thiểu là 35m.'
  },
  {
    id: 66, critical: false, tags: ALL,
    text: 'Đèn xi nhan (đèn báo rẽ) có màu gì?',
    options: ['Màu đỏ', 'Màu trắng', 'Màu vàng (cam)', 'Màu xanh lá'],
    correct: 2,
    explain: 'Đèn xi nhan màu vàng/cam để phân biệt với đèn phanh và đèn chiếu sáng.'
  },
  {
    id: 67, critical: false, tags: ALL,
    text: 'Biển báo có hình tam giác đều, viền đỏ, nền vàng dùng để báo hiệu điều gì?',
    options: ['Biển cấm', 'Biển hiệu lệnh bắt buộc', 'Biển cảnh báo nguy hiểm', 'Biển chỉ dẫn'],
    correct: 2,
    explain: 'Biển cảnh báo nguy hiểm: hình tam giác đều, nền vàng, viền đỏ.'
  },
  {
    id: 68, critical: false, tags: ALL,
    text: 'Khi gặp vạch kẻ đường liền (vạch liền nét), người lái xe được phép làm gì?',
    options: ['Vượt xe nếu làn trái trống', 'Sang làn trái để rẽ tại ngã tư', 'Không được vượt qua hoặc chuyển làn', 'Vượt khi tầm nhìn trên 200m'],
    correct: 2,
    explain: 'Vạch liền không được phép vượt qua hoặc đè lên.'
  },
  {
    id: 69, critical: false, tags: AUTO,
    text: 'Trong đô thị, tốc độ tối đa của xe ô tô trên đường phố thông thường là bao nhiêu?',
    options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
    correct: 1,
    explain: 'Trong khu đông dân cư tốc độ tối đa của ô tô là 50 km/h.'
  },
  {
    id: 70, critical: false, tags: AUTO,
    text: 'Trẻ em dưới bao nhiêu tuổi bắt buộc phải ngồi ghế riêng khi đi ô tô?',
    options: ['Dưới 3 tuổi', 'Dưới 10 tuổi', 'Dưới 4 tuổi', 'Dưới 6 tuổi'],
    correct: 1,
    explain: 'Trẻ dưới 10 tuổi hoặc chiều cao dưới 1,35m phải dùng ghế trẻ em và ngồi hàng ghế sau.'
  },
  {
    id: 71, critical: false, tags: ALL,
    text: 'Xe ô tô phải bật đèn chiếu sáng phía trước trong điều kiện nào?',
    options: ['Chỉ ban đêm từ 18h–6h', 'Khi trời tối, trong hầm, tầm nhìn dưới 300m', 'Chỉ khi trời mưa lớn', 'Bất kỳ lúc nào trên cao tốc'],
    correct: 1,
    explain: 'Bật đèn khi: ban đêm, trong hầm, sương mù, mưa lớn hoặc bất kỳ lúc nào tầm nhìn giảm dưới 300m.'
  },
  {
    id: 72, critical: false, tags: MOTO,
    text: 'Người điều khiển xe mô tô, gắn máy bắt buộc đội mũ bảo hiểm trong trường hợp nào?',
    options: ['Chỉ trên đường cao tốc và quốc lộ', 'Khi đi tốc độ trên 30 km/h', 'Mọi lúc khi tham gia giao thông', 'Chỉ ban đêm và khi trời mưa'],
    correct: 2,
    explain: 'Người điều khiển và người ngồi trên xe mô tô, gắn máy bắt buộc đội mũ bảo hiểm đạt chuẩn mọi lúc.'
  },
  {
    id: 73, critical: false, tags: AUTO,
    text: 'Người ngồi trên ô tô bắt buộc phải làm gì trước khi xe chuyển bánh?',
    options: ['Ngồi đúng chỗ và im lặng', 'Thắt dây an toàn', 'Để hành lý gọn gàng', 'Tắt điện thoại'],
    correct: 1,
    explain: 'Hành khách trên ô tô phải thắt dây an toàn trước khi xe khởi hành.'
  },
  {
    id: 74, critical: false, tags: ALL,
    text: 'Người lái xe phải giữ khoảng cách bên hông tối thiểu bao nhiêu khi chạy song song xe khác?',
    options: ['0,3m', '1,0m', '1,5m', '0,5m'],
    correct: 1,
    explain: 'Khi chạy song song, khoảng cách bên hông tối thiểu giữa hai xe là 1,0m.'
  },
  {
    id: 75, critical: false, tags: ALL,
    text: 'Người lái xe được phép sử dụng còi xe trong trường hợp nào?',
    options: [
      'Khi muốn vượt xe bất kỳ nơi nào', 
      'Khi cần thiết để báo hiệu phòng tránh tai nạn', 
      'Để gọi người quen bên đường', 
      'Khi gặp đèn đỏ muốn xe trước nhường đường'
    ],
    correct: 1,
    explain: 'Còi xe chỉ được sử dụng khi cần thiết để cảnh báo, phòng tránh tai nạn giao thông (như cảnh báo xe khác ở góc khuất, đường đèo núi).'
  },

  {
    id: 76, critical: false, tags: AUTO,
    text: 'Giấy phép lái xe hạng B2 có hiệu lực trong bao nhiêu năm?',
    options: ['5 năm', '10 năm', 'Vĩnh viễn', '3 năm'],
    correct: 1,
    explain: 'Theo luật hiện hành, Giấy phép lái xe hạng B2 có thời hạn 10 năm kể từ ngày cấp.'
  },
  {
    id: 77, critical: false, tags: ALL,
    text: 'Biển báo P (đậu xe) có hình dạng và màu sắc như thế nào?',
    options: ['Tròn, nền xanh lá, chữ P trắng', 'Vuông/chữ nhật, nền xanh lam, chữ P trắng', 'Tam giác, nền vàng, chữ P đen', 'Tròn, nền đỏ, chữ P trắng'],
    correct: 1,
    explain: 'Biển chỉ dẫn đỗ xe có hình vuông/chữ nhật, nền xanh lam, chữ P màu trắng.'
  },
  {
    id: 78, critical: false, tags: AUTO,
    text: 'Khi xe phía trước bật đèn phanh, người lái xe phía sau phải làm gì?',
    options: ['Bấm còi cảnh báo', 'Giữ nguyên tốc độ', 'Giảm tốc và tăng khoảng cách an toàn', 'Vượt sang làn bên ngay'],
    correct: 2,
    explain: 'Khi thấy xe trước phanh, giảm tốc ngay và tăng khoảng cách an toàn.'
  },
  {
    id: 79, critical: false, tags: ['C','D'],
    text: 'Xe nào được phép lưu thông vào làn đường dành cho xe buýt?',
    options: ['Xe tải nhẹ dưới 1,5 tấn', 'Xe taxi khi đón trả khách', 'Xe buýt, xe cứu thương, chữa cháy khi làm nhiệm vụ', 'Tất cả xe trong giờ thấp điểm'],
    correct: 2,
    explain: 'Làn xe buýt chỉ dành cho xe buýt và phương tiện ưu tiên làm nhiệm vụ.'
  },
  {
    id: 80, critical: false, tags: ALL,
    text: 'Người điều khiển phương tiện khi chuyển làn đường phải làm gì?',
    options: ['Chuyển nhanh để không cản trở xe khác', 'Bật xi nhan báo hiệu trước, quan sát và chuyển khi an toàn', 'Chỉ cần quan sát gương chiếu hậu', 'Bấm còi rồi chuyển làn'],
    correct: 1,
    explain: 'Khi chuyển làn phải bật xi nhan báo hiệu trước, quan sát gương và chuyển làn khi an toàn.'
  }
];

// ============================================================
// CRITICAL QUESTIONS — Tự động lọc 60 câu điểm liệt từ QUESTIONS
// ============================================================
const CRITICAL_QUESTIONS = QUESTIONS.filter(q => q.critical);

// Helper: lấy câu hỏi theo hạng bằng
function getQuestionsForLicense(licenseId) {
  return QUESTIONS.filter(q => q.tags.includes(licenseId));
}
document.getElementById("pdf-upload").addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file && file.type === "application/pdf") {
        var reader = new FileReader();
        reader.onload = function (e) {
            var pdfData = new Uint8Array(e.target.result);
            // Sử dụng pdf.js để load file PDF
            pdfjsLib.getDocument({ data: pdfData }).promise.then(function (pdf) {
                var pdfDisplay = document.getElementById("pdf-display");
                pdfDisplay.innerHTML = ""; // Xóa nội dung cũ

                // Lặp qua tất cả các trang và lấy text từ từng trang
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    pdf.getPage(pageNum).then(function (page) {
                        page.getTextContent().then(function (textContent) {
                            // Tạo một div để chứa nội dung text của từng trang
                            var pageDiv = document.createElement("div");
                            pageDiv.classList.add("page");

                            var textItems = textContent.items;
                            var pageText = "";

                            // Lặp qua từng đoạn text và nối chúng lại
                            textItems.forEach(function (item) {
                                pageText += item.str + " ";
                            });

                            // Hiển thị nội dung text của trang
                            pageDiv.textContent = pageText;
                            pdfDisplay.appendChild(pageDiv);
                        });
                    });
                }
            });
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert("Vui lòng chọn một file PDF!");
    }
});

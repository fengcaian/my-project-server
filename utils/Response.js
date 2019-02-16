
function Response(code, msg, data, totalRow, pageSize, currentPage) {
    this.code = code;
    this.msg = msg;
    if (totalRow) {
        this.data = {
            dataList: data,
            totalRow: totalRow,
            pageSize: pageSize,
            currentPage: currentPage
        }
    } else {
        this.data = data;
    }
}
module.exports = Response;
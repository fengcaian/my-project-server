
function Response(code, msg, data, totalRow, pageSize, currentPage) {
    this.code = code;
    this.msg = msg;
    if (totalRow) {
        this.result = {
            dataList: data,
            totalRow: Number(totalRow),
            pageSize: Number(pageSize),
            currentPage: Number(currentPage)
        }
    } else {
        this.result = data;
    }
}
module.exports = Response;
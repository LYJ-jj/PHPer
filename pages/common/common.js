/**
 * 商品类型枚举
 */
function getGoodsType(g_type)
{
  g_type = parseInt(g_type);
  switch (g_type) {
    case 1:
      return '虚拟';

    case 2:
      return '实物';

    default:
      return 'unknow';
  }
}

/**
 * 邮箱正则验证
 */
function validEmail(email)
{
  if (email == ''){
    return false;
  }
  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
  if ( !reg.test(email) ){
    return false;
  }

  return true;
}

exports.getGoodsType = getGoodsType;
exports.validEmail   = validEmail;
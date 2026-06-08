const PAYU_API_KEY = "4Vj8eK4rloUd272L48hsrarnUA";
const PAYU_MERCHANT_ID = "508029";
const PAYU_ACCOUNT_ID_CO = "512321";
const PAYU_CURRENCY = "COP";
const PAYU_SANDBOX_URL =
  "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/";

function md5(value) {
  function rotateLeft(number, amount) {
    return (number << amount) | (number >>> (32 - amount));
  }

  function addUnsigned(left, right) {
    const leftHigh = left & 0x80000000;
    const rightHigh = right & 0x80000000;
    const leftLow = left & 0x40000000;
    const rightLow = right & 0x40000000;
    const result = (left & 0x3fffffff) + (right & 0x3fffffff);

    if (leftLow & rightLow) {
      return result ^ 0x80000000 ^ leftHigh ^ rightHigh;
    }

    if (leftLow | rightLow) {
      if (result & 0x40000000) {
        return result ^ 0xc0000000 ^ leftHigh ^ rightHigh;
      }

      return result ^ 0x40000000 ^ leftHigh ^ rightHigh;
    }

    return result ^ leftHigh ^ rightHigh;
  }

  function f(x, y, z) {
    return (x & y) | (~x & z);
  }

  function g(x, y, z) {
    return (x & z) | (y & ~z);
  }

  function h(x, y, z) {
    return x ^ y ^ z;
  }

  function i(x, y, z) {
    return y ^ (x | ~z);
  }

  function transform(fn, a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, fn(b, c, d)), addUnsigned(x, ac)), s), b);
  }

  function convertToWordArray(text) {
    const messageLength = text.length;
    const wordArray = [];
    let wordCount;

    for (wordCount = 0; wordCount < messageLength - 3; wordCount += 4) {
      wordArray.push(
        text.charCodeAt(wordCount) |
          (text.charCodeAt(wordCount + 1) << 8) |
          (text.charCodeAt(wordCount + 2) << 16) |
          (text.charCodeAt(wordCount + 3) << 24)
      );
    }

    let finalWord = 0;

    switch (messageLength % 4) {
      case 0:
        finalWord = 0x80;
        break;
      case 1:
        finalWord = text.charCodeAt(wordCount) | 0x8000;
        break;
      case 2:
        finalWord =
          text.charCodeAt(wordCount) |
          (text.charCodeAt(wordCount + 1) << 8) |
          0x800000;
        break;
      case 3:
        finalWord =
          text.charCodeAt(wordCount) |
          (text.charCodeAt(wordCount + 1) << 8) |
          (text.charCodeAt(wordCount + 2) << 16) |
          0x80000000;
        break;
      default:
        break;
    }

    wordArray.push(finalWord);

    while ((wordArray.length % 16) !== 14) {
      wordArray.push(0);
    }

    wordArray.push(messageLength << 3);
    wordArray.push(messageLength >>> 29);

    return wordArray;
  }

  function wordToHex(valueToConvert) {
    let output = "";

    for (let count = 0; count <= 3; count += 1) {
      const byte = (valueToConvert >>> (count * 8)) & 255;
      output += `0${byte.toString(16)}`.slice(-2);
    }

    return output;
  }

  const utf8Value = unescape(encodeURIComponent(value));
  const words = convertToWordArray(utf8Value);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let index = 0; index < words.length; index += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;

    a = transform(f, a, b, c, d, words[index], 7, 0xd76aa478);
    d = transform(f, d, a, b, c, words[index + 1], 12, 0xe8c7b756);
    c = transform(f, c, d, a, b, words[index + 2], 17, 0x242070db);
    b = transform(f, b, c, d, a, words[index + 3], 22, 0xc1bdceee);
    a = transform(f, a, b, c, d, words[index + 4], 7, 0xf57c0faf);
    d = transform(f, d, a, b, c, words[index + 5], 12, 0x4787c62a);
    c = transform(f, c, d, a, b, words[index + 6], 17, 0xa8304613);
    b = transform(f, b, c, d, a, words[index + 7], 22, 0xfd469501);
    a = transform(f, a, b, c, d, words[index + 8], 7, 0x698098d8);
    d = transform(f, d, a, b, c, words[index + 9], 12, 0x8b44f7af);
    c = transform(f, c, d, a, b, words[index + 10], 17, 0xffff5bb1);
    b = transform(f, b, c, d, a, words[index + 11], 22, 0x895cd7be);
    a = transform(f, a, b, c, d, words[index + 12], 7, 0x6b901122);
    d = transform(f, d, a, b, c, words[index + 13], 12, 0xfd987193);
    c = transform(f, c, d, a, b, words[index + 14], 17, 0xa679438e);
    b = transform(f, b, c, d, a, words[index + 15], 22, 0x49b40821);

    a = transform(g, a, b, c, d, words[index + 1], 5, 0xf61e2562);
    d = transform(g, d, a, b, c, words[index + 6], 9, 0xc040b340);
    c = transform(g, c, d, a, b, words[index + 11], 14, 0x265e5a51);
    b = transform(g, b, c, d, a, words[index], 20, 0xe9b6c7aa);
    a = transform(g, a, b, c, d, words[index + 5], 5, 0xd62f105d);
    d = transform(g, d, a, b, c, words[index + 10], 9, 0x02441453);
    c = transform(g, c, d, a, b, words[index + 15], 14, 0xd8a1e681);
    b = transform(g, b, c, d, a, words[index + 4], 20, 0xe7d3fbc8);
    a = transform(g, a, b, c, d, words[index + 9], 5, 0x21e1cde6);
    d = transform(g, d, a, b, c, words[index + 14], 9, 0xc33707d6);
    c = transform(g, c, d, a, b, words[index + 3], 14, 0xf4d50d87);
    b = transform(g, b, c, d, a, words[index + 8], 20, 0x455a14ed);
    a = transform(g, a, b, c, d, words[index + 13], 5, 0xa9e3e905);
    d = transform(g, d, a, b, c, words[index + 2], 9, 0xfcefa3f8);
    c = transform(g, c, d, a, b, words[index + 7], 14, 0x676f02d9);
    b = transform(g, b, c, d, a, words[index + 12], 20, 0x8d2a4c8a);

    a = transform(h, a, b, c, d, words[index + 5], 4, 0xfffa3942);
    d = transform(h, d, a, b, c, words[index + 8], 11, 0x8771f681);
    c = transform(h, c, d, a, b, words[index + 11], 16, 0x6d9d6122);
    b = transform(h, b, c, d, a, words[index + 14], 23, 0xfde5380c);
    a = transform(h, a, b, c, d, words[index + 1], 4, 0xa4beea44);
    d = transform(h, d, a, b, c, words[index + 4], 11, 0x4bdecfa9);
    c = transform(h, c, d, a, b, words[index + 7], 16, 0xf6bb4b60);
    b = transform(h, b, c, d, a, words[index + 10], 23, 0xbebfbc70);
    a = transform(h, a, b, c, d, words[index + 13], 4, 0x289b7ec6);
    d = transform(h, d, a, b, c, words[index], 11, 0xeaa127fa);
    c = transform(h, c, d, a, b, words[index + 3], 16, 0xd4ef3085);
    b = transform(h, b, c, d, a, words[index + 6], 23, 0x04881d05);
    a = transform(h, a, b, c, d, words[index + 9], 4, 0xd9d4d039);
    d = transform(h, d, a, b, c, words[index + 12], 11, 0xe6db99e5);
    c = transform(h, c, d, a, b, words[index + 15], 16, 0x1fa27cf8);
    b = transform(h, b, c, d, a, words[index + 2], 23, 0xc4ac5665);

    a = transform(i, a, b, c, d, words[index], 6, 0xf4292244);
    d = transform(i, d, a, b, c, words[index + 7], 10, 0x432aff97);
    c = transform(i, c, d, a, b, words[index + 14], 15, 0xab9423a7);
    b = transform(i, b, c, d, a, words[index + 5], 21, 0xfc93a039);
    a = transform(i, a, b, c, d, words[index + 12], 6, 0x655b59c3);
    d = transform(i, d, a, b, c, words[index + 3], 10, 0x8f0ccc92);
    c = transform(i, c, d, a, b, words[index + 10], 15, 0xffeff47d);
    b = transform(i, b, c, d, a, words[index + 1], 21, 0x85845dd1);
    a = transform(i, a, b, c, d, words[index + 8], 6, 0x6fa87e4f);
    d = transform(i, d, a, b, c, words[index + 15], 10, 0xfe2ce6e0);
    c = transform(i, c, d, a, b, words[index + 6], 15, 0xa3014314);
    b = transform(i, b, c, d, a, words[index + 13], 21, 0x4e0811a1);
    a = transform(i, a, b, c, d, words[index + 4], 6, 0xf7537e82);
    d = transform(i, d, a, b, c, words[index + 11], 10, 0xbd3af235);
    c = transform(i, c, d, a, b, words[index + 2], 15, 0x2ad7d2bb);
    b = transform(i, b, c, d, a, words[index + 9], 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  return `${wordToHex(a)}${wordToHex(b)}${wordToHex(c)}${wordToHex(d)}`.toLowerCase();
}

export function getPayuPaymentData({ order, user, total }) {
  const amount = Number(total).toFixed(2);
  const referenceCode = order.$id;
  const description = `Compra HomeFix ${referenceCode}`;
  const responseUrl = `${window.location.origin}/payment-result`;
  const signature = md5(
    `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${amount}~${PAYU_CURRENCY}`
  );

  return {
    action: PAYU_SANDBOX_URL,
    fields: {
      merchantId: PAYU_MERCHANT_ID,
      accountId: PAYU_ACCOUNT_ID_CO,
      description,
      referenceCode,
      amount,
      tax: "0",
      taxReturnBase: "0",
      currency: PAYU_CURRENCY,
      signature,
      test: "1",
      buyerEmail: user.email,
      responseUrl,
      confirmationUrl: responseUrl,
      lng: "es",
    },
  };
}

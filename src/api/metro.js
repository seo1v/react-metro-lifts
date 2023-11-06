import axios from 'axios';
import { v4 as uuid } from 'uuid';

export async function getLocations() {
  return axios
    .get('metro.json')
    .then((res) => {
      return res.data.DATA.map((item) => ({ ...item, id: uuid() }));
    })
    .catch((e) => {
      console.log(e);
    });

  // ERR_SSL_PROTOCOL_ERROR 에러로 데이터 접근 불가하여 json 사용
  // const allData = [];
  // const ITEMS_PER_PAGE = 1000;
  // let page = 1;

  // try {
  //   while (true) {
  //     const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  //     const endItem = page * ITEMS_PER_PAGE;

  //     const res = await axios.get(
  //       `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_METRO_API_KEY}/json/SeoulMetroFaciInfo/${startItem}/${endItem}`
  //     );

  //     const data = res.data.SeoulMetroFaciInfo.row || [];

  //     allData.push(...data);

  //     if (data.length < ITEMS_PER_PAGE) {
  //       break;
  //     }

  //     page++;
  //   }

  //   return allData.map((item) => ({ ...item, id: uuid() }));
  // } catch (e) {
  //   console.log('문제가 발생했습니다.');
  // }
}

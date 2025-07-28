const video = document.getElementById('dmx-video');
const vmtLog = document.getElementById('vmt-log');

const mapVmt = new Map();



// video.currentTime が変更されたときに、左と右のライトを更新する
video.addEventListener('timeupdate', () => {
  const currentTime = video.currentTime;

  mapVmt.forEach((vmtData, forValue) => {
    // vmtData の中から、現在の時間に対応するデータを探す
    const currentVmt = vmtData.find(v => v.begin <= currentTime && v.end > currentTime);
    const targetLight = document.getElementById(forValue);
    if( !targetLight ) {
        console.warn(`No light element found for: ${forValue}`);
        return;
    }

    if( !currentVmt ) {
        targetLight.style.transition = 'none';
        targetLight.style.transform = 'rotate(0deg)';
        targetLight.style.filter = 'brightness(1)';
        targetLight.style.backgroundColor = 'transparent';
    } else {
        // 1 秒かけて回転させる
        targetLight.style.transition = 'transform 1s';
        targetLight.style.transform = `rotate(${currentVmt.pan}deg)`;
        targetLight.style.filter = `brightness(${currentVmt.dimmer / 255})`;
        targetLight.style.backgroundColor = currentVmt.color;
    }
  });

  // vmtLog に経過時間を表示
  vmtLog.textContent = `経過時間: ${Math.floor(currentTime)}秒`;
});

// track タグの src 属性で設定された vmt ファイルを読み込む関数
const loadVmtFiles = () => {
  const tracks = video.querySelectorAll('track[kind="metadata"]');
  tracks.forEach(track => {
    const vmtFile = track.src;
    // track タグの for 属性値を取得
    const forValue = track.getAttribute('for');
    // VMT ファイルを読み込む処理をここに追加
    fetch(vmtFile)
      .then(response => response.text())
      .then(data => {
        // VMT ファイルの内容を処理する
        console.log(`Loaded VMT file: ${vmtFile}`);
        const vmtData = parseVmtFile(data);
        console.log( vmtData )
        // forValue に対応する VMT データをマップに保存
        mapVmt.set(forValue, vmtData);
      })
      .catch(error => {
        console.error(`Error loading VMT file: ${vmtFile}`, error);
      });
  });
  console.log('VMT files loaded:', mapVmt);
};

// vmt ファイルのパースを行う関数
// ```
// 00:00:07.000 --> 00:00:09.500
// { "pan": 32, "tilt": 160, "dimmer": 255, "color": "rgb( 0, 0, 255 )" }
// ```
const parseVmtFile = (data) => {
    // VMT ファイルの内容をパースする処理
    const vmtLines = data.split('\n');

    const vmtData = [];
    vmtLines.forEach((line, index) => {
        // 時間の行を見つける
        const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
        console.log( timeMatch)
        if (timeMatch) {
            const beginSeconds = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
            const endSeconds = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
            // 次の行が JSON 形式であることを確認
            if (index + 1 < vmtLines.length) {
                try {
                    const jsonData = JSON.parse(vmtLines[index + 1]);
                    vmtData.push( { begin: beginSeconds, end: endSeconds, ...jsonData })
                } catch (e) {
                    // console.error(`Error parsing JSON at line ${index + 1}:`, e);
                }
            }
        }
    })
    return vmtData;
};

// ページ読み込み時に、 loadVmtFiles 関数を呼び出す
window.addEventListener('load', () => {
  loadVmtFiles();
});
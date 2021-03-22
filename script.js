let output = document.getElementById('output');
let file_selector = document.getElementById('file-selector');

function read_file(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener('load', event => {
            resolve(event.target.result);
        });
        reader.readAsText(file);
    });
}

function append(list, elem) {
    let li = document.createElement("li");
    li.textContent = elem;
    list.appendChild(li);
}

function parse_time(s) {
    let [time, ampm] = s.split(" ");
    let [hour, min] = time.split(":");
    hour = parseInt(hour);
    min = parseInt(min);
    console.assert(ampm == "AM" || ampm == "PM", "Expected AM or PM");
    if (ampm == "PM") {
        hour += 12;
    }
    return hour * 60 + min;
}

function midpoint(x, y) {
    return x + (y - x) / 2;
}

function compare_records(a, b) {
    let [name_a, _1, _2, _3, date_a, class_index_a] = a;
    let [name_b, _4, _5, _6, date_b, class_index_b] = b;

    if (class_index_a < class_index_b) {
        return -1;
    }
    if (class_index_a > class_index_b) {
        return 1;
    }

    let [_7, last_name_a] = name_a.split(" ");
    let [_8, last_name_b] = name_b.split(" ");
    let cmp = last_name_a.localeCompare(last_name_b, 'en', { sensitivity: 'base' });
    if (cmp != 0) {
        return cmp;
    }

    let [year_a, month_a, day_a] = date_a.split("-");
    let [year_b, month_b, day_b] = date_b.split("-");
    if (year_a < year_b) {
        return -1;
    }
    if (year_a > year_b) {
        return 1;
    }
    if (month_a < month_b) {
        return -1;
    }
    if (month_a > month_b) {
        return 1;
    }
    if (day_a < day_b) {
        return -1;
    }
    if (day_a > day_b) {
        return 1;
    }
    return 0;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

async function handle_files(event) {
    let file_list = event.target;
    output.innerHTML = '';

    let classes = [
        ["5th grade", "9:10 AM"],
        ["4th grade", "10:00 AM"],
        ["3rd grade", "11:00 AM"],
        ["Kindergarten", "1:00 PM"],
        ["1st grade", "1:30 PM"],
        ["2nd grade", "2:30 PM"],
    ];
    for (let i = 0; i < classes.length; i += 1) {
        classes[i][1] = parse_time(classes[i][1]);
    }

    let records = [];
    for (let file of file_list.files) {
        let date = file.name.split(' ')[0];

        let text = await read_file(file);
        for (let line of text.split("\n").slice(1)) {
            if (line == "") {
                continue;
            }
            line = line.split(",");
            let name = line[0];
            let email = line[1];
            let duration = line[2];
            let entered = line[3];
            let exited = line[4];
            let entered_min = parse_time(entered);
            let exited_min = parse_time(exited);
            let time = midpoint(entered_min, exited_min);

            let class_index = -1;
            for (let i = classes.length; i > 0; i -= 1) {
                let class_start_time = classes[i - 1][1];
                if (time >= class_start_time) {
                    class_index = i - 1;
                    break;
                }
            }
            console.assert(class_index != -1, "Enter/exit time didn't match any class period");

            records.push([name, email, entered, exited, date, class_index]);
        }
    }
    records.sort(compare_records);

    let text = "";
    for (let record of records) {
        let [name, email, entered, exited, date, class_index] = record;
        let class_name = classes[class_index][0];
        text += `${class_name},${name},${date},${entered},${exited},${email}\n`;
    }
    console.log(text);
    download('attendance.csv', text);
}

file_selector.addEventListener('change', handle_files);

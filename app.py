from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)

# 开启调试模式
app.debug = True

# 添加模板自动重载
app.config['TEMPLATES_AUTO_RELOAD'] = True

# 课程数据
schedules = {
    'user1': {
        'morning': [
            {
                'time': '08:00 - 08:45',
                'courses': [
                    {
                        'name': '博弈论',
                        'location': '卓越楼333',
                        'day': 1,
                        'span': 2
                    },
                    {
                        'name': '云计算技术',
                        'location': '一教332',
                        'day': 2,
                        'span': 2
                    },
                    {
                        'name': '多元统计与分析',
                        'location': '卓越楼527',
                        'day': 4,
                        'span': 2
                    }
                ]
            },
            {
                'time': '08:50 - 09:35',
                'span': 1
            },
            {
                'time': '09:55 - 10:40',
                'courses': [
                    {
                        'name': '医学信息集成技术',
                        'location': '一教317',
                        'day': 2,
                        'span': 3
                    },
                    {
                        'name': '计量经济学',
                        'location': '卓越楼233',
                        'day': 3,
                        'span': 3
                    },
                    {
                        'name': '医学人工智能',
                        'location': '一教510',
                        'day': 4,
                        'span': 3
                    },
                    {
                        'name': '中国共产党史',
                        'location': '一教100',
                        'day': 5,
                        'span': 2
                    }
                ]
            },
            {
                'time': '10:45 - 11:30',
                'span': 1
            },
            {
                'time': '11:35 - 12:20',
                'span': 1
            }
        ],
        'afternoon': [
            {
                'time': '13:15 - 14:00',
                'courses': [
                    {
                        'name': '移动医疗应用程序技术',
                        'location': '卓越楼123',
                        'day': 3,
                        'span': 2
                    }
                ]
            },
            {
                'time': '14:05 - 14:50',
                'span': 1
            },
            {
                'time': '15:05 - 15:50',
                'courses': [
                    {
                        'name': '科学与工程伦理',
                        'location': '卓越楼135',
                        'day': 3,
                        'span': 2
                    },
                    {
                        'name': '医疗信息系统',
                        'location': '卓越楼425',
                        'day': 4,
                        'span': 2
                    },
                    {
                        'name': '智慧物流与供应链',
                        'location': '四教107',
                        'day': 5,
                        'span': 2
                    }
                ]
            },
            {
                'time': '15:55 - 16:40',
                'span': 1
            }
        ],
        'evening': [
            {
                'time': '18:00 - 18:45',
                'span': 1
            },
            {
                'time': '18:50 - 19:35',
                'span': 1
            },
            {
                'time': '19:40 - 20:25',
                'span': 1
            }
        ]
    },
    'user2': {
        'morning': [
            {
                'time': '08:00 - 08:45',
                'courses': [
                    {
                        'name': '博弈论',
                        'location': '卓越楼333',
                        'day': 1,
                        'span': 2
                    },
                    {
                        'name': '项目管理',
                        'location': '国合楼310',
                        'day': 3,
                        'span': 2
                    }
                ]
            },
            {
                'time': '08:50 - 09:35',
                'span': 1
            },
            {
                'time': '09:55 - 10:40',
                'courses': [
                    {
                        'name': '算法设计与分析',
                        'location': '一教450',
                        'day': 1,
                        'span': 3
                    },
                    {
                        'name': '嵌入式系统软件',
                        'location': '一教146',
                        'day': 2,
                        'span': 3
                    },
                    {
                        'name': '编译原理',
                        'location': '一教405',
                        'day': 3,
                        'span': 3
                    },
                    {
                        'name': '系统建模与仿真',
                        'location': '一教305',
                        'day': 5,
                        'span': 3
                    }
                ]
            },
            {
                'time': '10:45 - 11:30',
                'span': 1
            },
            {
                'time': '11:35 - 12:20',
                'span': 1
            }
        ],
        'afternoon': [
            {
                'time': '13:15 - 14:00',
                'courses': [
                    {
                        'name': '软件测试',
                        'location': '一教146',
                        'day': 1,
                        'span': 3
                    },
                    {
                        'name': '软件协同设计',
                        'location': '一教432',
                        'day': 3,
                        'span': 3
                    },
                    {
                        'name': '深度学习',
                        'location': '一教116',
                        'day': 4,
                        'span': 3
                    }
                ]
            },
            {
                'time': '14:05 - 14:50',
                'span': 1
            },
            {
                'time': '15:05 - 15:50',
                'span': 1
            },
            {
                'time': '15:55 - 16:40',
                'span': 1
            }
        ],
        'evening': [
            {
                'time': '18:00 - 18:45',
                'courses': [
                    {
                        'name': '钱钟书作品导读',
                        'location': '一教150',
                        'day': 2,
                        'span': 3
                    }
                ]
            },
            {
                'time': '18:50 - 19:35',
                'span': 1
            },
            {
                'time': '19:40 - 20:25',
                'span': 1
            }
        ]
    },
    'user3': {
        'morning': [
            {
                'time': '08:00 - 08:45',
                'courses': [
                    {
                        'name': '医用电气安全技术',
                        'location': '一教209',
                        'day': 1,
                        'span': 2
                    },
                    {
                        'name': '机械制造技术基础',
                        'location': '一教205',
                        'day': 2,
                        'span': 2
                    },
                    {
                        'name': '医疗器械人因工程设计',
                        'location': '一教144',
                        'day': 4,
                        'span': 2
                    }
                ]
            },
            {
                'time': '08:50 - 09:35',
                'span': 1
            },
            {
                'time': '09:55 - 10:40',
                'courses': [
                    {
                        'name': '医用检验分析技术',
                        'location': '一教212',
                        'day': 1,
                        'span': 3
                    },
                    {
                        'name': '医疗器械系统设计',
                        'location': '一教319',
                        'day': 3,
                        'span': 3
                    },
                    {
                        'name': '管理信息系统',
                        'location': '卓越楼708',
                        'day': 4,
                        'span': 3
                    },
                    {
                        'name': '现代生命支持设备原理',
                        'location': '一教330',
                        'day': 5,
                        'span': 3
                    }
                ]
            },
            {
                'time': '10:45 - 11:30',
                'span': 1
            },
            {
                'time': '11:35 - 12:20',
                'span': 1
            }
        ],
        'afternoon': [
            {
                'time': '13:15 - 14:00',
                'courses': [
                    {
                        'name': '医用电磁兼容技术',
                        'location': '一教432',
                        'day': 1,
                        'span': 2
                    },
                    {
                        'name': '工程制图',
                        'location': '三教210',
                        'day': 2,
                        'span': 2
                    },
                    {
                        'name': '金融风险管理',
                        'location': '国合楼110',
                        'day': 3,
                        'span': 3
                    },
                    {
                        'name': '面向对象程序开发',
                        'location': '一教413',
                        'day': 5,
                        'span': 2
                    }
                ]
            },
            {
                'time': '14:05 - 14:50',
                'span': 1
            },
            {
                'time': '15:05 - 15:50',
                'span': 1
            },
            {
                'time': '15:55 - 16:40',
                'span': 1
            }
        ],
        'evening': [
            {
                'time': '18:00 - 18:45',
                'span': 1
            },
            {
                'time': '18:50 - 19:35',
                'span': 1
            },
            {
                'time': '19:40 - 20:25',
                'span': 1
            }
        ]
    }
}

@app.route('/')
def index():
    return render_template('schedule.html')

@app.route('/get_schedule/<user>')
def get_schedule(user):
    if user not in schedules:
        return jsonify({'error': 'User not found'}), 404
    return render_template('schedule_content.html', schedule=schedules[user])

if __name__ == '__main__':
    # 启用热重载和调试模式
    app.run(debug=True, host='0.0.0.0', port=5000) 
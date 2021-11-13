#!/bin/bash
# install npm/yarn/pm2 for web app
GREEN_COLOR='\033[32m' #绿
YELOW_COLOR='\033[33m' #黄
BLUE_COLOR='\033[36m' #蓝
RES='\033[0m'
underline='\033[4m'
oldpath=$(cd "$(dirname "$0")"; pwd);
type=$(getconf LONG_BIT);

echo -e "\n"
echo -ne "请输入安装位置${BLUE_COLOR}[默认为当前用户文件夹]${RES}："
read installPath

if [ ! -d $installPath ]; then
  echo -e "\n"
  echo -e "${YELOW_COLOR}路径错误,请重新执行shell${RES}"
  exit
fi

echo -e "\n"
echo -e "Node官网下载地址：${underline}${BLUE_COLOR}https://nodejs.org/zh-cn/download/releases/${RES}";
echo -e "\n"
if (($type==64)); then
    echo -e "Node稳定版：${GREEN_COLOR}12.16.1${RES}";
    echo -e "\n"
    echo -e "Node最新版：${GREEN_COLOR}13.9.0${RES}";
else
    $type = 86;
    echo -e "32位系统建议安装Node.js 8.x以下版本如${GREEN_COLOR}8.15.1${RES}";
fi
echo -e "\n"
echo -e "系统版本：${GREEN_COLOR}x${type}${RES}"
echo -e "\n"
echo -n "请输入需要安装的Node版本号："
read v

echo -e "\n"

cd $installPath

echo -e "\n"

# 拆分

OLD_IFS="$IFS"
IFS="."
IFS="$OLD_IFS"

echo "https://nodejs.org/download/release/v"${v}"/node-v"${v}"-linux-x"${type}".tar.gz"

echo -e "\n"

wget "https://nodejs.org/download/release/v"${v}"/node-v"${v}"-linux-x"${type}".tar.gz"

tar -zxf "node-v"${v}"-linux-x"${type}".tar.gz"

rm -rf "node-v"${v}"-linux-x"${type}".tar.gz"

cd "node-v"${v}"-linux-x"${type}'/bin'

cur_dir=$(cd "$(dirname "$0")"; pwd);

rm -rf /usr/local/bin/npm
rm -rf /usr/local/bin/node
rm -rf /usr/local/bin/yarn

ln -s $cur_dir"/node" "/usr/local/bin/node";

ln -s $cur_dir"/npm" "/usr/local/bin/npm";

npm install yarn -g

npm install forever -g

ln -s $cur_dir"/yarn" "/usr/local/bin/yarn";

ln -s $cur_dir"/forever" "/usr/local/bin/forever";

cd ${oldpath}

echo -e "\n"

echo -e "Node"${GREEN_COLOR}${v}${RES}"安装完成"

echo -e "\n"

# install mysql for database usage
#yum -y install wget
#
#echo -e '\033[1;32m 安装MySQL \033[0m'
#echo -e '\033[1;32m 开始安装mysql最新稳定版5.7（实际上为社区版本)\033[0m'
#echo -e '\033[1;32m 下载mysql安装包 \033[0m'
#wget -c http://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
#echo -e '\033[1;32m 安装mysql依赖 \033[0m'
#yum localinstall -y mysql57-community-release-el7-11.noarch.rpm
## echo '查看最新稳定版本信息'
## yum repolist all | grep mysql
#echo -e '\033[1;32m 安装mysql社区服务器 \033[0m'
#yum -y install mysql-community-server
#echo -e '\033[1;32m 修改mysql配置文件 \033[0m'
#sed -i '$a\federated'  /etc/my.cnf
#sed -i '$a\max_connections = 2000'  /etc/my.cnf
#sed -i '$a\max_allowed_packet = 64M'  /etc/my.cnf
#sed -i '$a\skip-grant-tables=1'  /etc/my.cnf
#echo -e '\033[1;32m 设置mysql开机启动 \033[0m'
#systemctl enable mysqld
#mkdir /usr/local/mysql
#echo -e '\033[1;32m 启动mysql \033[0m'
#systemctl start mysqld
#
#echo -e -n '\033[1;32m 请输入将要设置的mysql root用户密码\033[0m'
#read mysql_passwd
#echo ${mysql_passwd}
#mysql -u root -e "update mysql.user  set authentication_string=password('${mysql_passwd}') where user='root';flush privileges;"
#echo -e "\033[1;32m mysql密码设置完毕！ \033[0m"
#echo -e "\033[1;32m 清除yum安装包 \033[0m"
#yum -y clean all
#sed -i "s/skip-grant-tables=1//g"  /etc/my.cnf
#echo -e '\033[1;32m 重启mysql \033[0m'
#systemctl restart mysqld
#mysql -u root -p${mysql_passwd} -e "set global validate_password_policy=0;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "set global validate_password_mixed_case_count=0;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "set global validate_password_number_count=3;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "set global validate_password_special_char_count=0;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "set global validate_password_length=3;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "alter user 'root'@'localhost' identified by '${mysql_passwd}';flush privileges;" --connect-expired-password
#mysql -u root -p${mysql_passwd} -e "SHOW VARIABLES LIKE 'validate_password%';" --connect-expired-password
#
#
## write the database using test.sql
#echo ${oldpath}
#
#mysql -uroot -p${mysql_passwd} -e "source ${oldpath}/server/test.sql" --connect-expired-password
#
#yarn install
## run the app front & backend
#nohup yarn dev >/dev/null 2>&1 &
#echo "\n"
#cd "${oldpath}/server"
#pwd
#yarn install
#forever start app.js

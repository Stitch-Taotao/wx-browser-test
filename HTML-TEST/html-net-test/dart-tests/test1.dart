void test1() {
  List<int> ints = [1, 2, 3];
  List<num> nums = ints;
  nums.add(3.14);
  final i = nums.last;
  print(i);
}

void main(List<String> args) {
  test1();
}

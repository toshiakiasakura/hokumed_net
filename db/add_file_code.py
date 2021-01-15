import migration

def main():
    from_lis = ['id', ]
    to_lis = ['id', 'code', 'kind',  'no_doc', 'type']
    fetch, insert = migration.create_queries(from_lis, to_lis, 'user', 'file__code')
    data = [
        (257, 96, 'exam', '中間追試', '問題' ),
        (258, 97, 'exam', '期末追試', '問題'),
        (259, 1096, 'exam', '中間追試', '解答'),
        (260, 1097, 'exam', '期末追試', '解答'),
    ]

    migration.insertCommand(insert,data)

if __name__ == "__main__":
    main()

import sys
import pkgutil

def get_stdlib_modules():
    stdlib_modules = set()
    for module in pkgutil.iter_modules():
        if module.name not in sys.builtin_module_names and not module.ispkg:
            stdlib_modules.add(module.name)
    return sorted(stdlib_modules)

def main():
    print(f"Python version: {sys.version.split()[0]}")
    stdlib_modules = get_stdlib_modules()
    print("Standard library modules:")
    print(", ".join(stdlib_modules))

if __name__ == "__main__":
    main()
